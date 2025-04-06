from dotenv import load_dotenv
import pandas as pd
import psycopg2
import os
import uuid

# Load environment variables from .env2 file
load_dotenv(dotenv_path=".env2")

df = pd.read_csv("Data/raw_data/results_with_description.csv")
# Generate a UUID for each row in the DataFrame
df['id'] = [uuid.uuid4() for _ in range(len(df))]

# Connect to the PostgreSQL database
conn = psycopg2.connect(os.environ.get("POST_DB_LINK"), sslmode='require')


def create_table(query:str):

    """ Connect to the PostgreSQL database and a table using a user
    specified query if it doesnt already exist."""

    # Create a cursor object
    cursor = conn.cursor()
    # Execute a query to create a table
    cursor.execute(query)

    conn.commit()
    # Close the cursor and connection
    cursor.close()


def populate_table(df):

    """ Connect to the PostgreSQL database and the user specified table
    with the desired query."""

    # Create a cursor object
    cursor = conn.cursor()

    # Iterate over the rows of the DataFrame and insert each row into the table
    for index, row in df.iterrows():
        cursor.execute(
            """INSERT INTO optigame_products (id, asin, title, price, rating, sales_volume, reviews_count, description)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
               ON CONFLICT (id) DO NOTHING""",
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
    conn.commit()
    # Close the cursor and connection
    cursor.close()

def retrieve_all_from_table(table_name:str):

    """ Connect to the PostgreSQL database and retrieves all data from a user specified table"""

    # Create a cursor object
    cursor = conn.cursor()
    # Execute a query to retrieve data from the table
    cursor.execute("SELECT * FROM {table_name}".format(table_name=table_name))

    # Fetch all rows from the result of the query
    rows = cursor.fetchall()
  
    # Create a DataFrame from the rows
    df = pd.DataFrame(rows, columns=['id','asin','title','price','rating','sales_volume','reviews_count','description'])
    return df

def delete_table(table_name:str):

    """ Connect to the PostgreSQL database and deletes hser provided table"""

    # Create a cursor object
    cursor = conn.cursor()
    # Execute a query to delete the table
    cursor.execute("DROP TABLE IF EXISTS {table_name}".format(table_name=table_name))
    conn.commit()
    # Close the cursor and connection
    cursor.close()

if __name__ == "__main__":
    table_name = "optigame_products"
    table_creation_query = """CREATE TABLE IF NOT EXISTS optigame_products (
    id UUID PRIMARY KEY,
    asin VARCHAR(255),
    title TEXT,
    price FLOAT,
    rating FLOAT,
    sales_volume TEXT,
    description TEXT,
    reviews_count INTEGER
        )
    """

    #note changed sales volume to text because of the error with the data type

    # Deleting the table if it exists
    delete_table(table_name)
    # Create the table if it doesn't exist
    create_table(table_creation_query)
    # Populate the table with data from the DataFrame
    populate_table(df)
    # returning data from the database
    df = retrieve_all_from_table(table_name)
    print(df)
    print("Data loaded successfully into the database.")