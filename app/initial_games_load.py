from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
import dotenv
from utils.db_handler import DatabaseHandler
from utils.amazon_api import add_images
import pandas as pd
import uuid
from dotenv import load_dotenv

table_name = "optigame_products"

# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")
URL_database = os.environ.get("DATABASE_URL")
engine = DatabaseHandler(URL_database)
engine.delete_table(table_name)

# Set your Oxylabs API Credentials.
username = os.environ.get("USERNAME_OXY2")
password = os.environ.get("PASSWORD_OXY2")

# loading dataframe
df = pd.read_csv("FastApi/Data/raw_data/test.csv")
print("Dataframe loaded from CSV file")

if 'image_link' not in df.columns:
    df = add_images(df, username, password)

# Ensuring no nan values in the dataframe
df['title'] = df['title'].fillna("")
df['asin'] = df['asin'].fillna(0.0)
df['price'] = df['price'].fillna(0.0)
df['rating'] = df['rating'].fillna(0.0)
df['sales_volume'] = df['sales_volume'].fillna("0")
df['description'] = df['description'].fillna("")
df['reviews_count'] = df['reviews_count'].fillna(0)
df['image_link'] = df['image_link'].fillna("")

# ensuring asin is unique
df = df.drop_duplicates(subset='asin', keep='first')

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
    reviews_count INTEGER,
    image_link TEXT)
    """
# Create the table if it doesn't exist
engine.create_table(table_creation_query)
# Populate the table with data from the DataFrame
engine.populate_games_table(df)
# returning data from the database
df = engine.retrieve_all_from_table(table_name)

