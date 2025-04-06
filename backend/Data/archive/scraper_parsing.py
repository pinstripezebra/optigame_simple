import json
import pandas as pd


def parse_item(item):
    # Extract the relevant fields from the item
    return {
        "asin": item["asin"],
        "title": item["title"],
        "price": item["price"],
        "rating": item["rating"],
        "sales_volume": item["sales_volume"],
        "reviews_count": item["reviews_count"]}

def convert_to_dataframe(data:list):
    # iterates through list of dictionaries and creates a DataFrame
    dataframe_list = []
    for item in data:
        parsed_item = parse_item(item)
        dataframe_list.append(pd.DataFrame(parsed_item, index=[0]))
    df = pd.concat(dataframe_list, ignore_index=True)

    return df

# Read the JSON object from the .txt file
with open("Data/output.txt", "r", encoding="utf-8") as file:
    results = json.load(file)['results'][0]['content']['results']
    data_paid = results['paid']  # paid results
    data_organic = results['organic']  # organic results
    print("results type", type(results))
    print(results.keys())



# Parsing data, converting to dataframe, and writing to csv
combined_df = convert_to_dataframe(data_paid + data_organic)
combined_df.to_csv("Data/raw_data/paid_results.csv", index=False)  
