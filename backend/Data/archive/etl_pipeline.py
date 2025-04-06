from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json
from utils.amazon_api import convert_to_dataframe, add_description

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
                                     page=2, 
                                     max_results=30, 
                                     parse=True,
                                     context = [{'key': 'autoselect_variant', 'value': True}])

# Save the result in JSON format to a .txt file
with open("Data/raw_data/output.txt", "w", encoding="utf-8") as file:
    json.dump(result.raw, file, indent=4)  # Write JSON data with indentation for readability

# Read the JSON object from the .txt file
with open("Data/raw_data/output.txt", "r", encoding="utf-8") as file:
    results = json.load(file)['results'][0]['content']['results']
    data_paid = results['paid']  # paid results
    data_organic = results['organic']  # organic results

# Parsing data, converting to dataframe, and writing to csv
combined_df = convert_to_dataframe(data_paid + data_organic)

# adding descriptions
combined_df = add_description(combined_df, username, password)
combined_df.to_csv("Data/raw_data/total_results_with_description.csv", index=False)