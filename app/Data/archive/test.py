
from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json

# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")

# Set your Oxylabs API Credentials.
username = os.environ.get("USERNAME_OXY")
password = os.environ.get("PASSWORD_OXY")


import requests
from pprint import pprint

# Structure payload.
payload = {
    'source': 'amazon_product',
    'query': 'B08MVWB4SC',
    'geo_location': '90210',
    'parse': True
}

# Get response.
response = requests.request(
    'POST',
    'https://realtime.oxylabs.io/v1/queries',
    auth=(username, password),
    json=payload,
)

# Print prettified response to stdout.
output = response.json()['results'][0]['content']
print(output.keys())
print(output['description'])

