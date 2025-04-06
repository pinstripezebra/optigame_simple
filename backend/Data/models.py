from pydantic import BaseModel
from uuid import UUID,uuid4
from typing import Optional
from enum import Enum
from sqlalchemy import Column, String, Float, Integer
import sqlalchemy.dialects.postgresql as pg
from sqlalchemy.ext.declarative import declarative_base
import uuid
from uuid import UUID

# Initialize the base class for SQLAlchemy models
Base = declarative_base()

class Role(str, Enum):
    admin = 'admin'
    user = 'user'

class User(BaseModel):
    id: Optional[UUID] = uuid4()
    username: str
    password: str
    role: Role

# This is the game model for the database
# we have separate classes for the pydantic model and the SQLAlchemy model
class Game(Base):
    __tablename__ = "optigame_products"  # Table name in the PostgreSQL database

    id = Column(pg.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    rating = Column(Float, nullable=True)
    sales_volume = Column(String, nullable=True)
    reviews_count = Column(Integer, nullable=True)
    asin = Column(String, unique=True, nullable=False)


class GameModel(BaseModel):
    id: Optional[UUID]
    title: str
    description: Optional[str]
    price: float
    rating: Optional[float]
    sales_volume: Optional[str]
    reviews_count: Optional[int]
    asin: str

    class Config:
        orm_mode = True  # Enable ORM mode to work with SQLAlchemy objects
        from_attributes = True # Enable attribute access for SQLAlchemy objects


# This is the User model for the database
# we have separate classes for the pydantic model and the SQLAlchemy model
class User(Base):
    __tablename__ = "optigame_users"  # Table name in the PostgreSQL database

    id = Column(pg.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=True)
    email = Column(String, nullable=False)
    role = Column(Role, nullable=True)


class UserModel(BaseModel):
    id: Optional[UUID]
    username: str
    password: str
    emai: str
    role: Role

    class Config:
        orm_mode = True  # Enable ORM mode to work with SQLAlchemy objects
        from_attributes = True # Enable attribute access for SQLAlchemy objects

