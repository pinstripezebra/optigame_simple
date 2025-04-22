from dotenv import load_dotenv
import os
from oxylabs import RealtimeClient
from utils.db_handler import DatabaseHandler
from utils.amazon_api import add_images
import pandas as pd


#-------------------------------#
#PART 1: Retrieving games data asin
#-------------------------------#

# creating database handler instance
load_dotenv(dotenv_path=".env")
URL_database = os.environ.get("POST_DB_LINK")

# ensuring database URL is set
if URL_database is None:
    raise ValueError("POST_DB_LINK environment variable not set.")

my_db_handler = DatabaseHandler(URL_database)
table_name = "optigame_products"

# returning data from optigame_products table
df = my_db_handler.retrieve_all_from_table(table_name)
unique_products = df['asin'].unique().tolist()


#-------------------------------#
#PART 2: Scraping images for each asin
#-------------------------------#

# Set your Oxylabs API Credentials.
username = os.environ.get("USERNAME_OXY")
password = os.environ.get("PASSWORD_OXY")

# Initialize the Realtime client with your credentials.
client = RealtimeClient(username, password)

# adding images to the dataframe
test_df = add_images(df.head(1), username, password)
print(test_df)