from oxylabs import RealtimeClient
from dotenv import load_dotenv
import os
import json
import requests
import pandas as pd

# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")

# Set your Oxylabs API Credentials.
username = os.environ.get("USERNAME_OXY")
password = os.environ.get("PASSWORD_OXY")

df = pd.read_csv("Data/raw_data/results.csv")
keys = df['asin'].tolist()
descriptions = []

for key in keys:
    # Structure payload.
    payload = {
        'source': 'amazon_product',
        'query': '{key}'.format(key=key),
        'geo_location': '90210',
        'parse': True
    }

    try:
        # Get response.
        response = requests.request(
            'POST',
            'https://realtime.oxylabs.io/v1/queries',
            auth=(username, password),
            json=payload,
        )

        # Print prettified response to stdout.
        output = response.json()['results'][0]['content']
        descriptions.append(output['description'])
    except:
        print(f"Error retrieving description for ASIN {key}.")
        descriptions.append("")
df['description'] = descriptions
df.to_csv("Data/raw_data/results_with_description.csv", index=False)