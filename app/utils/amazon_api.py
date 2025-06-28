import json
import pandas as pd
import requests
import concurrent.futures

def parse_item(item):
    # Extract the relevant fields from the item
    try:
        return {
            "asin": item["asin"],
            "title": item["title"],
            "price": item["price"],
            "rating": item["rating"],
            "sales_volume": item["sales_volume"],
            "reviews_count": item["reviews_count"]}
    except:
        print(f"Error parsing item: {item}")
        return {
            "asin": item["asin"],
            "title": item["title"],
            "price": None,
            "rating": None,
            "sales_volume": None,
            "reviews_count": None}


def parse_results(result):
    """Parses the results from the Oxylabs API."""
    # parsing data
    results = result['results'][0]['content']['results']
    if 'paid' in results and 'organic' in results:
        data_paid = results['paid']  # paid results
        data_organic = results['organic']  # organic results

        # Parsing data, converting to dataframe, and writing to csv
        combined_df = convert_to_dataframe(data_paid + data_organic)
    elif 'organic' in results:
        data_organic = results['organic']  # organic results
        combined_df = convert_to_dataframe(data_organic)
    elif 'paid' in results:
        data_paid = results['paid']
        combined_df = convert_to_dataframe(data_paid)

    return combined_df

def convert_to_dataframe(data:list):
    # iterates through list of dictionaries and creates a DataFrame
    dataframe_list = []
    for item in data:
        parsed_item = parse_item(item)
        dataframe_list.append(pd.DataFrame(parsed_item, index=[0]))
    df = pd.concat(dataframe_list, ignore_index=True)

    return df


def fetch_description(key, username, password):

    """helper function that fetches the description of a product from Oxylabs API"""

    payload = {
        'source': 'amazon_product',
        'query': key,
        'geo_location': '90210',
        'parse': True
    }
    try:
        response = requests.request(
            'POST',
            'https://realtime.oxylabs.io/v1/queries',
            auth=(username, password),
            json=payload,
        )
        output = response.json()['results'][0]['content']
        return output.get('description', "")
    except Exception as e:
        print(f"Error retrieving description for ASIN {key}: {e}")
        return ""

def add_descriptions(df, username, password):

    """Fetches product description for each ASIN in dataframe using concurrent requests"""

    keys = df['asin'].tolist()
    descriptions = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(fetch_description, key, username, password) for key in keys]
        for future in concurrent.futures.as_completed(futures):
            descriptions.append(future.result())


    df['description'] = descriptions
    return df


def fetch_image(key, username, password):

    """Helper function to fetch the image link for a product from Oxylabs API"""

    payload = {
        'source': 'amazon_product',
        'query': key,
        'geo_location': '90210',
        'parse': True
    }
    try:
        response = requests.request(
            'POST',
            'https://realtime.oxylabs.io/v1/queries',
            auth=(username, password),
            json=payload,
        )
        output = response.json()
        images = output['results'][0]['content'].get('images', [])
        return images[0] if images else ""
    except Exception as e:
        print(f"Error retrieving image for ASIN {key}: {e}")
        return ""

def add_images(df, username, password):

    """Fetches product image link for each ASIN in dataframe using concurrent requests."""
    
    keys = df['asin'].tolist()
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        image_links = list(executor.map(lambda key: fetch_image(key, username, password), keys))
    df['image_link'] = image_links
    return df