from fastapi import FastAPI, Depends, HTTPException
from Data.models import User, Game, Role, GameModel, UserModel
from typing import List
from uuid import uuid4, UUID
import os
from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv



# database connection string
user_db: List[User] = [
    User(id=UUID("835a05cf-3e31-4b75-977b-6196442d5158"), username="admin", password="admin", role=Role.admin),
    User(id=UUID("e06f8d98-40fe-4447-9983-668d8db5ca6e"), username="user", password="user", role=Role.user)
]
# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")

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

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api/v1/users")
async def fetch_users():
    return user_db

@app.get("/api/v1/products")
async def fetch_products(db: Session = Depends(get_db)):
    # Query the database using the SQLAlchemy Game model
    products = db.query(Game).all()
    # Serialize the results using the Pydantic GameModel
    return [GameModel.from_orm(product) for product in products]


@app.post("/api/v1/users")
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