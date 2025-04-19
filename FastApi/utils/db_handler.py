from dotenv import load_dotenv
import pandas as pd
import psycopg2
import os
import uuid

# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")

class DatabaseHandler:
    """Class to handle PostgreSQL database connection and operations"""

    def __init__(self, db_url:str=os.environ.get("POST_DB_LINK")):

        """Initialize the database connection."""
        self.conn = psycopg2.connect(db_url, sslmode='require')
        self.conn.autocommit = True  # Enable autocommit mode

    def close(self):
        """Close the database connection."""
        self.conn.close()

    def create_table(self,query:str):

        """ Connect to the PostgreSQL database and a table using a user
        specified query if it doesnt already exist."""

        # Create a cursor object
        cursor = self.conn.cursor()
        # Execute a query to create a table
        cursor.execute(query)

        self.conn.commit()
        # Close the cursor and connection
        cursor.close()


    def retrieve_all_from_table(self,table_name:str):

        """ Connect to the PostgreSQL database and retrieves all data from a user specified table"""

        try:
            # Create a cursor object
            cursor = self.conn.cursor()

            # Fetch column names dynamically
            cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}'")
            columns = [row[0] for row in cursor.fetchall()]

            # Execute a query to retrieve data from the table
            cursor.execute("SELECT * FROM {table_name}".format(table_name=table_name))

            # Fetch all rows from the result of the query
            rows = cursor.fetchall()
        
            # Create a DataFrame from the rows
            df = pd.DataFrame(rows, columns=columns)
            return df
        
        except Exception as e:
            print("Error retrieving data from table: ", e)
            return None

    def delete_table(self,table_name:str):

        """ Connect to the PostgreSQL database and deletes hser provided table"""

        # Create a cursor object
        cursor = self.conn.cursor()
        # Execute a query to delete the table
        cursor.execute("DROP TABLE IF EXISTS {table_name}".format(table_name=table_name))
        self.conn.commit()

    def populate_users_table(self,df):

        """ Connect to the PostgreSQL database and populates user table with provided dataframe."""

        # Create a cursor object
        cursor = self.conn.cursor()

        # Iterate over the rows of the DataFrame and insert each row into the table
        for index, row in df.iterrows():
            cursor.execute(
                """INSERT INTO optigame_users (id, username, password, email, role)
                VALUES (%s, %s, %s, %s, %s)""",
                (
                    str(row['id']),  # Convert UUID to string
                    row['username'],
                    row['password'],
                    row['email'],
                    row['role'],
                )
            )
        self.conn.commit()
        # Close the cursor and connection
        cursor.close()

    def populate_games_table(self,df):

        """ Connect to the PostgreSQL database and updates the games table with
        data from the input dataframe."""

        # Create a cursor object
        cursor = self.conn.cursor()

        # Iterate over the rows of the DataFrame and insert each row into the table
        for index, row in df.iterrows():
            cursor.execute(
                """INSERT INTO optigame_products (id, asin, title, price, rating, sales_volume, reviews_count, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    str(row['id']),  # Convert UUID to string
                    row['asin'],
                    row['title'],
                    row['price'],
                    row['rating'],
                    row['sales_volume'],
                    row['reviews_count'],
                    row['description'],
                )
            )
        self.conn.commit()
        # Close the cursor and connection
        cursor.close()

    def populate_game_tags_table(self,df):

        """ Connect to the PostgreSQL database and updates the game tags table with
        data from the input dataframe."""

        # Create a cursor object
        cursor = self.conn.cursor()

        # Iterate over the rows of the DataFrame and insert each row into the table
        for index, row in df.iterrows():
            cursor.execute(
                """INSERT INTO optigame_products (id, asin, game_tags)
                VALUES (%s, %s, %s)""",
                (
                    str(row['id']),  # Convert UUID to string
                    row['asin'],
                    row['game_tags']
                )
            )
        self.conn.commit()
        # Close the cursor and connection
        cursor.close()

