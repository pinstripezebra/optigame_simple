from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
from utils.db_handler import DatabaseHandler
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import uuid
from dotenv import load_dotenv

source_table_name1 = "user_game" # contains user_id:asin mapping
source_table_name2 = "optigame_game_tags" # contains asin:game_tags mapping
target_table_name = "user_recommendations"

load_dotenv(dotenv_path=".env2")
URL_database = os.environ.get("DATABASE_URL")
engine = DatabaseHandler(URL_database)


# game tag data
tag_df = engine.retrieve_all_from_table(source_table_name2)

unique_tags = tag_df['game_tags'].drop_duplicates().sort_values().tolist()
unique_games = tag_df['asin'].drop_duplicates().sort_values().tolist()


def add_game_vector(unique_tags, unique_games, df):
    """
    Create a game vector for each game based on its tags.
    """
    game_vectors = []
    for game in unique_games:
        tags = df[df['asin'] == game]['game_tags'].tolist()
        vector = [1 if tag in tags else 0 for tag in unique_tags]
        game_vectors.append(vector)
    return pd.DataFrame(game_vectors, columns=unique_tags, index=unique_games)


# vectorizing game tags
game_vectors = add_game_vector(unique_tags, unique_games, tag_df)