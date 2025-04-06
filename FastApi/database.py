from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
import dotenv
from utils.db_handler import DatabaseHandler

URL_database = os.environ.get("POST_DB_LINK")
engine = DatabaseHandler(URL_database)

games = engine.retrieve_all_from_table("optigame_products")
print(games)

users = engine.retrieve_all_from_table("optigame_users")
print(users)