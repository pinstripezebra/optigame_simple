from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
import dotenv
from utils.db_handler import DatabaseHandler

URL_database = os.environ.get("POST_DB_LINK")
engine = DatabaseHandler(URL_database)