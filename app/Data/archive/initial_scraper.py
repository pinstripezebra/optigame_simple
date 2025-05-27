from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json

# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")

# Set your Oxylabs API Credentials.
username = os.environ.get("USERNAME_OXY")
password = os.environ.get("PASSWORD_OXY")

# Initialize the Realtime client with your credentials.
client = RealtimeClient(username, password)

# Use `bing_search` as a source to scrape Bing with nike as a query.
#result = client.amazon.scrape_search(query="board games", country="us", page=1, max_results=10, parse=True)
result = client.amazon.scrape_search(query="board games", 
                                     country="us", 
                                     page=1, 
                                     max_results=10, 
                                     parse=True,
                                     context = [{'key': 'autoselect_variant', 'value': True}])
# Print the result in JSON format.
print(result.raw)

# Save the result in JSON format to a .txt file
with open("Data/output2.txt", "w", encoding="utf-8") as file:
    json.dump(result.raw, file, indent=4)  # Write JSON data with indentation for readability

print("JSON data has been saved to output.txt")