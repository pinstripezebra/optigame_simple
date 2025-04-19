
from dotenv import load_dotenv
from utils.db_handler import DatabaseHandler
import pandas as pd
import spacy
from collections import Counter
from typing import List


def extract_common_noun_phrases_with_numbers(nlp, df: pd.DataFrame, title_column: str = "title") -> pd.DataFrame:
    """
    Extracts common nouns and combined noun phrases (including number-noun phrases) from the title column of a DataFrame.

    Args:
        nlp: The spaCy language model.
        df (pd.DataFrame): The input DataFrame containing a 'title' column.
        title_column (str): The name of the column containing text data.

    Returns:
        pd.DataFrame: A DataFrame with an additional 'common_noun_phrases' column containing lists of common nouns and noun phrases.
    """
    # Ensure the title column exists
    if title_column not in df.columns:
        raise ValueError(f"Column '{title_column}' not found in DataFrame.")

    # Function to extract common nouns and noun phrases from a single text
    def get_common_noun_phrases(text):
        ext = text.lower()
        doc = nlp(text)
        noun_phrases = []
        current_phrase = []

        for i, token in enumerate(doc):
            if token.pos_ == "NOUN":  # Check if the token is a noun
                # If the previous token is a number, include it in the phrase
                if i > 0 and doc[i - 1].pos_ == "NUM":
                    current_phrase.append(doc[i - 1].text)
                current_phrase.append(token.text)
            else:
                if current_phrase:  # If we have a phrase, join it and add to the list
                    noun_phrases.append(" ".join(current_phrase))
                    current_phrase = []

        # Add the last phrase if it exists
        if current_phrase:
            noun_phrases.append(" ".join(current_phrase))

        return noun_phrases

    # Apply the function to the title column
    df["common_noun_phrases"] = df[title_column].apply(lambda x: get_common_noun_phrases(str(x)))
    return df


def lemmatize_common_noun_phrases(nlp, df: pd.DataFrame, common_noun_phrases_column: str = "common_noun_phrases") -> pd.DataFrame:
    """
    Lemmatizes the words in the 'common_noun_phrases' column of a DataFrame.

    Args:
        nlp: The spaCy language model.
        df (pd.DataFrame): The input DataFrame containing a 'common_noun_phrases' column.
        common_noun_phrases_column (str): The name of the column containing lists of common noun phrases.

    Returns:
        pd.DataFrame: A DataFrame with the 'common_noun_phrases' column lemmatized.
    """
    # Ensure the common_noun_phrases column exists
    if common_noun_phrases_column not in df.columns:
        raise ValueError(f"Column '{common_noun_phrases_column}' not found in DataFrame.")

    # Function to lemmatize a list of noun phrases
    def lemmatize_phrases(phrases_list):
        lemmatized_phrases = []
        for phrase in phrases_list:
            doc = nlp(phrase)
            lemmatized_phrase = " ".join([token.lemma_ for token in doc])
            lemmatized_phrases.append(lemmatized_phrase)
        return lemmatized_phrases

    # Apply the lemmatization function to the common_noun_phrases column
    df[common_noun_phrases_column] = df[common_noun_phrases_column].apply(lemmatize_phrases)
    return df

def eliminate_shorter_subtags(df: pd.DataFrame, common_noun_phrases_column: str = "common_noun_phrases") -> pd.DataFrame:
    """
    Eliminates shorter subtags from the 'common_noun_phrases' column if a longer parent tag exists.

    Args:
        df (pd.DataFrame): The input DataFrame containing a 'common_noun_phrases' column.
        common_noun_phrases_column (str): The name of the column containing lists of common noun phrases.

    Returns:
        pd.DataFrame: A DataFrame with the 'common_noun_phrases' column updated to remove shorter subtags.
    """
    # Ensure the common_noun_phrases column exists
    if common_noun_phrases_column not in df.columns:
        raise ValueError(f"Column '{common_noun_phrases_column}' not found in DataFrame.")

    # Function to remove shorter subtags
    def filter_subtags(phrases_list):
        # Sort phrases by length in descending order
        phrases_list = sorted(phrases_list, key=len, reverse=True)
        filtered_phrases = []

        for phrase in phrases_list:
            # Add the phrase if it's not a substring of any already added phrase
            if not any(phrase in longer_phrase for longer_phrase in filtered_phrases):
                filtered_phrases.append(phrase)

        return filtered_phrases

    # Apply the filtering function to the common_noun_phrases column
    df[common_noun_phrases_column] = df[common_noun_phrases_column].apply(filter_subtags)
    return df

def get_top_common_nouns(df: pd.DataFrame, common_nouns_column: str = "common_nouns", top_x: int = 10) -> List[str]:
    """
    Returns a list of the top x most common nouns from the 'common_nouns' column.

    Args:
        df (pd.DataFrame): The input DataFrame containing a 'common_nouns' column.
        common_nouns_column (str): The name of the column containing lists of common nouns.
        top_x (int): The number of top common nouns to return.

    Returns:
        List[str]: A list of the top x most common nouns.
    """
    # Ensure the common_nouns column exists
    if common_nouns_column not in df.columns:
        raise ValueError(f"Column '{common_nouns_column}' not found in DataFrame.")

    # Flatten the list of common nouns across all rows
    all_nouns = [noun for nouns_list in df[common_nouns_column] for noun in nouns_list]

    # Count the frequency of each noun
    noun_counts = Counter(all_nouns)

    # Get the top x most common nouns
    top_common_nouns = [noun for noun, _ in noun_counts.most_common(top_x)]

    return top_common_nouns


def filter_tags_with_substring(df: pd.DataFrame, common_noun_phrases_column: str = "common_noun_phrases", substring: str = "game") -> List[str]:
    """
    Filters and returns all tags from the 'common_noun_phrases' column that contain a specific substring.

    Args:
        df (pd.DataFrame): The input DataFrame containing a 'common_noun_phrases' column.
        common_noun_phrases_column (str): The name of the column containing lists of common noun phrases.
        substring (str): The substring to search for in the tags.

    Returns:
        List[str]: A list of tags containing the specified substring.
    """
    # Ensure the common_noun_phrases column exists
    if common_noun_phrases_column not in df.columns:
        raise ValueError(f"Column '{common_noun_phrases_column}' not found in DataFrame.")

    # Flatten the list of tags across all rows and filter by substring
    tags_with_substring = [
        tag for phrases_list in df[common_noun_phrases_column]
        for tag in phrases_list if substring in tag
    ]

    return tags_with_substring

def filter_and_order_tags_by_frequency(df: pd.DataFrame, common_noun_phrases_column: str = "common_noun_phrases", substring: str = "game") -> List[tuple]:
    """
    Filters tags containing a specific substring (not at the start of the string) and orders them by their frequency of occurrence.

    Args:
        df (pd.DataFrame): The input DataFrame containing a 'common_noun_phrases' column.
        common_noun_phrases_column (str): The name of the column containing lists of common noun phrases.
        substring (str): The substring to filter tags by.

    Returns:
        List[tuple]: A list of tuples where each tuple contains a tag and its frequency, sorted by frequency in descending order.
    """
    # Ensure the common_noun_phrases column exists
    if common_noun_phrases_column not in df.columns:
        raise ValueError(f"Column '{common_noun_phrases_column}' not found in DataFrame.")

    # Flatten the list of tags across all rows and filter by substring
    filtered_tags = [
        tag for phrases_list in df[common_noun_phrases_column]
        for tag in phrases_list if substring in tag and not tag.startswith(substring)
    ]

    # Count the frequency of each filtered tag
    tag_counts = Counter(filtered_tags)

    # Sort tags by frequency in descending order
    sorted_tags = tag_counts.most_common()

    return sorted_tags

def add_game_tags_column(df: pd.DataFrame, most_frequent_games: List[tuple], common_noun_phrases_column: str = "common_noun_phrases") -> pd.DataFrame:
    """
    Adds a new column 'game_tags' to the DataFrame containing tags that match between the row's
    'common_noun_phrases' column and the most_frequent_games list.

    Args:
        df (pd.DataFrame): The input DataFrame containing a 'common_noun_phrases' column.
        most_frequent_games (List[tuple]): A list of tuples where each tuple contains a tag and its frequency.
        common_noun_phrases_column (str): The name of the column containing lists of common noun phrases.

    Returns:
        pd.DataFrame: The updated DataFrame with a new 'game_tags' column.
    """
    # Extract the tags from the most_frequent_games list
    frequent_game_tags = {tag for tag, _ in most_frequent_games}

    # Function to find matching tags for each row
    def find_matching_tags(phrases_list):
        return [tag for tag in phrases_list if tag in frequent_game_tags]

    # Apply the function to the common_noun_phrases column
    df["game_tags"] = df[common_noun_phrases_column].apply(find_matching_tags)
    return df