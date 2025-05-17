from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv
from utils.db_handler import DatabaseHandler
import pandas as pd
import uuid

load_dotenv(dotenv_path=".env2")
table_name = "optigame_user_games"
URL_database = os.environ.get("DATABASE_URL")
engine = DatabaseHandler(URL_database)
engine.delete_table(table_name)

initial_user_game = pd.DataFrame({
    "id": [str(uuid.uuid4()), str(uuid.uuid4())],
    "username": ["admin_username", "user_username"],
    "asin": ["B008J87PVC", "B08BHHRSPK"] 
})

engine.create_table("""CREATE TABLE IF NOT EXISTS optigame_user_games (
    UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    asin VARCHAR(255) NOT NULL
        )
    """)

engine.populate_user_game_table(initial_user_game)
engine.close()
