from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json
from utils.amazon_api import convert_to_dataframe, add_descriptions, parse_results, add_images
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
result = client.amazon.scrape_search(query="board games", 
                                     country="us", 
                                     sort_by = "bestsellers",
                                     start_page=1,
                                     max_results=2, 
                                     parse=True,
                                     context = [{'key': 'autoselect_variant', 'value': True}])

# Convert the response object to JSON
response_json = result.raw
# parsing results
combined_df = parse_results(response_json)
print(combined_df.head())