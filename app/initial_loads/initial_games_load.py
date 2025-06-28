from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json
from utils.amazon_api import convert_to_dataframe, add_descriptions, parse_results, add_images
from utils.db_handler import DatabaseHandler
import uuid
import pandas as pd


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
                                     start_page=1,
                                     max_results=2, 
                                     parse=True,
                                     context = [{'key': 'autoselect_variant', 'value': True}])

# Convert the response object to JSON
response_json = result.raw
# parsing results
combined_df = parse_results(response_json)

# adding descriptions
combined_df = add_descriptions(combined_df, username, password)

# adding image link 
combined_df = add_images(combined_df, username, password)

# Ensuring no nan values in the dataframe
combined_df['title'] = combined_df['title'].fillna("")
combined_df['price'] = combined_df['price'].fillna(0.0)
combined_df['rating'] = combined_df['rating'].fillna(0.0)
combined_df['sales_volume'] = combined_df['sales_volume'].fillna("0")
combined_df['description'] = combined_df['description'].fillna("")
combined_df['reviews_count'] = combined_df['reviews_count'].fillna(0)
combined_df['image_link'] = combined_df['image_link'].fillna(0)

# Appending new data to old data
csv_path = "Data/raw_data/games_for_load.csv"
if os.path.exists(csv_path):
    existing_df = pd.read_csv(csv_path)
    combined_df = pd.concat([existing_df, combined_df], ignore_index=True)
    combined_df = combined_df.drop_duplicates(subset=['asin'], keep='first')

combined_df.to_csv("Data/raw_data/games_for_load.csv", index=False)
