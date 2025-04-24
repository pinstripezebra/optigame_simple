import json
import pandas as pd
import requests

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


def add_descriptions(df, username, password):

    descriptions = []
    keys = df['asin'].tolist()

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
    return df


def add_images(df, username, password):

    image_links = []
    keys = df['asin'].tolist()

    for key in keys:
        print(f"Retrieving image for ASIN {key}...")
        # Structure payload.
        payload = {
            'source': 'amazon_product',
            'query': '{key}'.format(key=key),
            'geo_location': '90210',
            'parse': True
        }


        if True:
            # Get response.
            response = requests.request(
                'POST',
                'https://realtime.oxylabs.io/v1/queries',
                auth=(username, password),
                json=payload,
            )
            payload = {
                'source': 'amazon_product',
                'query': 'B07FZ8S74R',
                'geo_location': '90210',
                'parse': True
            }


            # Print prettified response to stdout.
            output = response.json()
            output = output['results'][0]['content']['images']
            image_links.append(output[0])
        else:
            print(f"Error retrieving description for ASIN {key}.")
            image_links.append("")
    df['image_link'] = image_links
    return df