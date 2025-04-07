from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json
from utils.amazon_api import convert_to_dataframe, add_descriptions, parse_results
from utils.db_handler import DatabaseHandler
import uuid


#-------------------------------#
#PART 1: Scraping Data from Oxylabs API
#-------------------------------#

# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")

# Set your Oxylabs API Credentials.
username = os.environ.get("USERNAME_OXY")
password = os.environ.get("PASSWORD_OXY")

# Initialize the Realtime client with your credentials.
client = RealtimeClient(username, password)

# searching for board games
result = client.amazon.scrape_search(query="rpg board games", 
                                     country="us", 
                                     start_page=8,
                                     max_results=100, 
                                     parse=True,
                                     context = [{'key': 'autoselect_variant', 'value': True}])

# Convert the response object to JSON
response_json = result.raw
# parsing results
combined_df = parse_results(response_json)

# adding descriptions and saving csv
combined_df = add_descriptions(combined_df, username, password)

# Ensuring no nan values in the dataframe
combined_df['title'] = combined_df['title'].fillna("")
combined_df['price'] = combined_df['price'].fillna(0.0)
combined_df['rating'] = combined_df['rating'].fillna(0.0)
combined_df['sales_volume'] = combined_df['sales_volume'].fillna("0")
combined_df['description'] = combined_df['description'].fillna("")
combined_df['reviews_count'] = combined_df['reviews_count'].fillna(0)
combined_df.to_csv("Data/raw_data/results_with_description.csv", index=False)

#-------------------------------#
#PART 2: Loading Data into PostgreSQL Database
#-------------------------------#
combined_df['id'] = [uuid.uuid4() for _ in range(len(combined_df))]
my_db_handler = DatabaseHandler()
table_name = "optigame_products"
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
#my_db_handler.delete_table(table_name)
# Create the table if it doesn't exist
my_db_handler.create_table(table_creation_query)
# Populate the table with data from the DataFrame
my_db_handler.populate_games_table(combined_df)
# returning data from the database
df = my_db_handler.retrieve_all_from_table(table_name)

print("Data loaded successfully into the database.")

# writing backup dataset
df.to_csv("Data/raw_data/total_results_with_description.csv", index=False)