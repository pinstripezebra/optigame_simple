from fastapi import FastAPI, Depends, HTTPException, status
from uuid import uuid4, UUID
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import dotenv_values
from datetime import datetime, timedelta

# security imports
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import jwt

# custom imports
from FastApi.models import User, Game, GameModel, UserModel, GameTags, GameTagsModel, UniqueGameTags, UniqueGameTagsModel, User_Game_Model, User_Game, GameSimilarity,GameSimilarityModel


# Load the .env file from the parent directory
config = dotenv_values("./.env2")

# Load the database connection string from the environment variable
DATABASE_URL = config["DATABASE_URL"]
USER_TABLE = config["USER_TABLE"]


# Initialize the database connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Create the database tables (if they don't already exist)
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the FastAPI app
app = FastAPI(title="Game Store API", version="1.0.0")

# secure the API with OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Add CORS middleware to allow requests from the React app
origins = ["http://localhost:3000", "http://localhost:8000", " http://localhost:5174/"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173", "http://localhost:8000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT configuration
SECRET_KEY = config["SECRET_KEY"]
ALGORITHM = config["ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = int(config["ACCESS_TOKEN_EXPIRE_MINUTES"])

#-------------------------------------------------#
# ----------PART 1: GET METHODS-------------------#
#-------------------------------------------------#




@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/api/v1/games/")
async def fetch_products(asin: str = None, db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Game model
    if asin:
        products = db.query(Game).filter(Game.asin == asin).all()
    else:
        products = db.query(Game).all()
    return [GameModel.from_orm(product) for product in products]


@app.get("/api/v1/users/")
async def fetch_users(username: str, password: str, db: Session = Depends(get_db)):
    user = user_authentication(db, username, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return [UserModel.from_orm(user)]

@app.get("/api/v1/genres/")
async def fetch_game_tags(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Game model
    gametags = db.query(GameTags).all()
    return [GameTagsModel.from_orm(gametag) for gametag in gametags]

@app.get("/api/v1/genres_filtered/")
async def fetch_game_tags_filtered(genre: str, db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy GameTags model and filter by genre
    gametags = db.query(GameTags).filter(GameTags.game_tags == genre).all()
    return [GameTagsModel.from_orm(gametag) for gametag in gametags]

@app.get("/api/v1/similar_games/")
async def fetch_similar_games(asin: str, db: Session = Depends(get_db)):
    # Query the database and return result
    similar_games = db.query(GameSimilarity).filter(GameSimilarity.game1 == asin).all()
    return [GameSimilarityModel.from_orm(game) for game in similar_games]


@app.get("/api/v1/unique_genres/")
async def fetch_unique_game_tags(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Unique Game tags
    gametags = db.query(UniqueGameTags).all()
    return [UniqueGameTagsModel.from_orm(gametag) for gametag in gametags]

@app.get("/api/v1/user_game/")
async def fetch_user_game(username: str, db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemyfor user_games
    user_games = db.query(User_Game).filter(User_Game.username == username)
    return [User_Game_Model.from_orm(user_game) for user_game in user_games]


@app.get("/api/v1/user_game_all/")
async def fetch_user_game_all(db: Session = Depends(get_db)):

    # Query the database using the SQLAlchemy Unique Genres 
    user_games = db.query(User_Game).all()
    return [User_Game_Model.from_orm(user_game) for user_game in user_games]

# for verifying JWT token
@app.get("/api/v1/verify/{token}")
async def verify_token_endpoint(token: str):
    try:
        payload = verify_token(token)
        return {"message": "Token is valid", "payload": payload}
    except HTTPException as e:
        raise e

#-------------------------------------------------#
# ----------PART 2: POST METHODS------------------#
#-------------------------------------------------#


# for adding a new user-game match to database
@app.post("/api/v1/user_game/")
async def create_user_game(user_game: User_Game_Model, db: Session = Depends(get_db)):
    # Check if the entry already exists
    existing = db.query(User_Game).filter_by(username=user_game.username, asin=user_game.asin).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already has this game.")

    # Only include id if provided, otherwise let SQLAlchemy generate it
    user_game_data = {
        "username": user_game.username,
        "asin": user_game.asin
    }
    if user_game.id is not None:
        # Ensure it's a UUID object
        user_game_data["id"] = UUID(str(user_game.id))

    db_user_game = User_Game(**user_game_data)
    db.add(db_user_game)
    db.commit()
    db.refresh(db_user_game)
    return db_user_game


# for adding a new user to database
@app.post("/api/v1/user/")
async def  create_user(user: UserModel, db: Session = Depends(get_db)):
    # Check if the entry already exists
    existing = db.query(User).filter_by(username=user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists.")
    
    # Hash the password before storing
    hashed_password = pwd_context.hash(user.password)

    # Only include id if provided, otherwise let SQLAlchemy generate it
    user_data = {
        "username": user.username,
        "password": hashed_password,
        "email": user.email,
        "role": user.role
    }
    if user.id is not None:
        # Ensure it's a UUID object
        user_data["id"] = UUID(str(user.id))

    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# for generating a JWT token for user authentication
@app.post("/api/v1/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = user_authentication(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) if "ACCESS_TOKEN_EXPIRE_MINUTES" in config and ACCESS_TOKEN_EXPIRE_MINUTES else timedelta(minutes=15)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

#-------------------------------------------------#
# ----------PART 3: HELPER METHODS----------------#
#-------------------------------------------------#

# helper function to authenticate user by hasing password
def user_authentication(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not pwd_context.verify(password, user.password):
        return None
    return user

# helper function to create JWT access token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta is None:
        expire = datetime.utcnow() + timedelta(minutes=15)
    else:
        expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# helper function to verify JWT token
def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return payload
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")