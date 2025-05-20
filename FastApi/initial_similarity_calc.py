from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
from utils.db_handler import DatabaseHandler
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import uuid
from dotenv import load_dotenv

target_table_name = "game_similarity"
source_table_name = "optigame_game_tags"

load_dotenv(dotenv_path=".env2")
URL_database = os.environ.get("DATABASE_URL")
engine = DatabaseHandler(URL_database)

# game tag data
df = engine.retrieve_all_from_table(source_table_name)

unique_tags = df['game_tags'].drop_duplicates().sort_values().tolist()
unique_games = df['asin'].drop_duplicates().sort_values().tolist()
print(unique_tags)

def add_game_vector(unique_tags, unique_games):
    """
    Create a game vector for each game based on its tags.
    """
    game_vectors = []
    for game in unique_games:
        tags = df[df['asin'] == game]['game_tags'].tolist()
        vector = [1 if tag in tags else 0 for tag in unique_tags]
        game_vectors.append(vector)
    return pd.DataFrame(game_vectors, columns=unique_tags, index=unique_games)

def calculate_similarity(game_vectors):
    """
    Calculate the cosine similarity between game vectors.
    """
    similarity_matrix = cosine_similarity(game_vectors)
    df_wide = pd.DataFrame(similarity_matrix, index=game_vectors.index, columns=game_vectors.index)

    # pivoting the DataFrame to get a wide format
    df_long = df_wide.reset_index().melt(id_vars='index')
    df_long.columns = ['game1', 'game2', 'similarity']

    df_long = df_long[df_long['game1'] != df_long['game2']]
    df_long = df_long.sort_values(by = ['similarity'], ascending=False).reset_index(drop=True)
    return df_long

# creating game vectors
similarity_df = add_game_vector(unique_tags, unique_games)


# calculating similarity matrix and pivoting to long format
similarity_matrix = calculate_similarity(similarity_df)
print(similarity_matrix)
