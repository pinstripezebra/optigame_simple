from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json
import sys
print(os.getcwd())
sys.path.append(os.path.abspath(os.getcwd()))
#sys.path.append(os.path.abspath(os.path.join(os.getcwd(),os.pardir, 'utils')))
from app.utils.amazon_api import add_descriptions, parse_results, add_images
from app.utils.db_handler import DatabaseHandler
import uuid
import pandas as pd
import sys
import time


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
result = client.amazon.scrape_search(query="building + board game", 
                                     country="us", 
                                     sort_by = "bestsellers",
                                     start_page= 5,
                                     max_results=400, 
                                     parse=True,
                                     context = [{'key': 'autoselect_variant', 'value': True}])

# Convert the response object to JSON
response_json = result.raw
# parsing results
combined_df = parse_results(response_json)

# adding descriptions
start_time = time.time()
combined_df = add_descriptions(combined_df, username, password)
end_time = time.time()
print(f"add_descriptions execution time: {end_time - start_time:.2f} seconds")

# adding image link 
start_time = time.time()
combined_df = add_images(combined_df, username, password)
end_time = time.time()
print(f"add_images execution time: {end_time - start_time:.2f} seconds")

# Ensuring no nan values in the dataframe
combined_df['title'] = combined_df['title'].fillna("")
combined_df['price'] = combined_df['price'].fillna(0.0)
combined_df['rating'] = combined_df['rating'].fillna(0.0)
combined_df['sales_volume'] = combined_df['sales_volume'].fillna("0")
combined_df['description'] = combined_df['description'].fillna("")
combined_df['reviews_count'] = combined_df['reviews_count'].fillna(0)
combined_df['image_link'] = combined_df['image_link'].fillna(0)

# Appending new data to old data
csv_path = "app/Data/raw_data/games_for_load.csv"
if os.path.exists(csv_path):
    print('File exists, appending new data to existing data.')
    existing_df = pd.read_csv(csv_path)
    combined_df = pd.concat([existing_df, combined_df], ignore_index=True)
    combined_df = combined_df.drop_duplicates(subset=['asin'], keep='first')

combined_df.to_csv("app/Data/raw_data/games_for_load.csv", index=False)
print(combined_df.head())
print(combined_df.size)
