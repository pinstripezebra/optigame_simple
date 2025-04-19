
from dotenv import load_dotenv
import os
import json
from utils.amazon_api import convert_to_dataframe, add_descriptions, parse_results
from utils.db_handler import DatabaseHandler
import uuid

# creating database handler instance
my_db_handler = DatabaseHandler()
table_name = "optigame_products"


# returning data from the database
df = my_db_handler.retrieve_all_from_table(table_name)