from fastapi import FastAPI, Depends, HTTPException
from FastApi.models import User, Game, GameModel, UserModel, GameTags, GameTagsModel, UniqueGameTags, UniqueGameTagsModel, User_Game_Model, User_Game
from typing import List
from uuid import uuid4, UUID
import os
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import dotenv_values
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

# Load the .env file from the parent directory
config = dotenv_values("./.env2")

# Load the database connection string from the environment variable
DATABASE_URL = config["DATABASE_URL"]
USER_TABLE = config["USER_TABLE"]

print(DATABASE_URL)

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
origins = ["http://localhost:3000", "http://localhost:8000", " http://localhost:5174/"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173", "http://localhost:8000"],  # React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    # Serialize the results using the Pydantic GameModel
    return [GameModel.from_orm(product) for product in products]


@app.get("/api/v1/users/")
async def fetch_users(username: str, password: str, db: Session = Depends(get_db)):
    # Query the database for users matching the username and password
    users = db.query(User).filter(User.username == username, User.password == password).all()
    # Serialize the results using the Pydantic UserModel
    return [UserModel.from_orm(user) for user in users]

@app.get("/api/v1/users_all/")
async def fetch_all_users(db: Session = Depends(get_db)):
    # Query the database for users matching the username and password
    users = db.query(User).all()
    # Serialize the results using the Pydantic UserModel
    return [UserModel.from_orm(user) for user in users]

@app.get("/api/v1/genres/")
async def fetch_game_tags(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Game model
    gametags = db.query(GameTags).all()
    # Serialize the results using the Pydantic GameModel
    return [GameTagsModel.from_orm(gametag) for gametag in gametags]

@app.get("/api/v1/unique_genres/")
async def fetch_unique_game_tags(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Unique Genres 
    gametags = db.query(UniqueGameTags).all()
    # Serialize the results using the Pydantic Unqiue Genres Model
    return [UniqueGameTagsModel.from_orm(gametag) for gametag in gametags]

@app.get("/api/v1/user_game/")
async def fetch_user_game(username: str, db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Unique Genres 
    user_games = db.query(User_Game).filter(User_Game.username == username)
    # Serialize the results using the Pydantic Unqiue Genres Model
    return [User_Game_Model.from_orm(user_game) for user_game in user_games]


@app.get("/api/v1/user_game_all/")
async def fetch_user_game_all(db: Session = Depends(get_db)):

    # Query the database using the SQLAlchemy Unique Genres 
    user_games = db.query(User_Game).all()
    # Serialize the results using the Pydantic Unqiue Genres Model
    return [User_Game_Model.from_orm(user_game) for user_game in user_games]


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
    existing = db.query(User).filter_by(username=user.username, password=user.password).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists.")

    # Only include id if provided, otherwise let SQLAlchemy generate it
    user_data = {
        "username": user.username,
        "password": user.password,
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

