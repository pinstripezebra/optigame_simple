from fastapi import FastAPI, Depends, HTTPException
from FastApi.models import User, Game, Role, GameModel, UserModel, GameTags, GameTagsModel, UniqueGameTags, UniqueGameTagsModel
from typing import List
from uuid import uuid4, UUID
import os
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


# Load the database connection string from the environment variable
DATABASE_URL = os.environ.get("POST_DB_LINK")
USER_TABLE = os.environ.get("USER_TABLE")

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
    allow_origins=["http://localhost:5174", "http://localhost:5173"],  # React app's URL
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
async def fetch_products(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy User model
    products = db.query(Game).all()
    # Serialize the results using the Pydantic UserModel
    return [GameModel.from_orm(product) for product in products]


@app.get("/api/v1/users/")
async def fetch_users(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Game model
    users = db.query(User).all()
    # Serialize the results using the Pydantic GameModel
    return [UserModel.from_orm(user) for user in users]

@app.get("/api/v1/genres/")
async def fetch_game_tags(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Game model
    gametags = db.query(GameTags).all()
    # Serialize the results using the Pydantic GameModel
    return [GameTagsModel.from_orm(gametag) for gametag in gametags]

@app.get("/api/v1/unique_genres/")
async def fetch_unique_game_tags(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Game model
    gametags = db.query(UniqueGameTags).all()
    # Serialize the results using the Pydantic GameModel
    return [UniqueGameTagsModel.from_orm(gametag) for gametag in gametags]




#-------------------------------------------------#
# ----------PART 2: POST METHODS------------------#
#-------------------------------------------------#

@app.post("/api/v1/users/")
async def create_user(user: UserModel, db: Session = Depends(get_db)):
    """
    Create a new user and insert it into the user table.
    """
    # Create a new User instance
    new_user = User(
        id=uuid4(),  # Generate a new UUID for the user
        username=user.username,
        password=user.password,
        role=user.role
    )

    try:
        # Add the new user to the database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)  # Refresh to get the new user's data from the database
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="User with this username already exists")

    return {"message": "User created successfully", "user": new_user}