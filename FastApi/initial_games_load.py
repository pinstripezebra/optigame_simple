from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
import dotenv
from utils.db_handler import DatabaseHandler
import pandas as pd
import uuid

table_name = "optigame_products"
URL_database = os.environ.get("POST_DB_LINK")
engine = DatabaseHandler(URL_database)
engine.delete_table(table_name)

# loading dataframe
df = pd.read_csv("FastApi/Data/raw_data/clean_total_results_with_description.csv")

# Ensuring no nan values in the dataframe
df['title'] = df['title'].fillna("")
df['asin'] = df['asin'].fillna(0.0)
df['price'] = df['price'].fillna(0.0)
df['rating'] = df['rating'].fillna(0.0)
df['sales_volume'] = df['sales_volume'].fillna("0")
df['description'] = df['description'].fillna("")
df['reviews_count'] = df['reviews_count'].fillna(0)
print(df['price'].apply(pd.to_numeric, errors='coerce').isna())
print(df['rating'].apply(pd.to_numeric, errors='coerce').isna())
df.to_csv("FastApi/Data/raw_data/test.csv", index=False)

table_creation_query = """CREATE TABLE IF NOT EXISTS optigame_products (
    id UUID PRIMARY KEY,
    asin VARCHAR(255),
    title TEXT,
    price FLOAT,
    rating FLOAT,
    sales_volume TEXT,
    description TEXT,
    reviews_count INTEGER
        )
    """
# Create the table if it doesn't exist
engine.create_table(table_creation_query)
# Populate the table with data from the DataFrame
engine.populate_games_table(df)
# returning data from the database
df = engine.retrieve_all_from_table(table_name)

