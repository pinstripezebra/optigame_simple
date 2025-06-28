from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
import dotenv
from utils.db_handler import DatabaseHandler
import pandas as pd
import uuid

URL_database = os.environ.get("POST_DB_LINK")
engine = DatabaseHandler(URL_database)
engine.delete_table("optigame_users")

initial_users = pd.DataFrame({
    "id": [uuid.uuid4() for _ in range(2)],
    "username": ["admin_username", "user_username"],
    "password": ["admin_password", "user_password"],
    "email": ["test1@gmail.com", "test2@gmail.com"],
    "role": ["admin", "user"]
})

engine.create_table("""CREATE TABLE IF NOT EXISTS optigame_users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
        )
    """)

engine.populate_users_table(initial_users)
engine.close()

