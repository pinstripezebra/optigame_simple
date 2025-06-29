
import pandas as pd
import time
import functools
import numpy as np

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        execution_time = end_time - start_time
        print(f"Function {func.__name__} took {execution_time:.4f} seconds")
        return result
    return wrapper


def drop_special_characters(df, column):
    """
    Removes special characters from the specified string column in the DataFrame.
    Only keeps alphanumeric characters and spaces.
    """
    df[column] = df[column].astype(str).str.replace(r'[^A-Za-z0-9\s]', '', regex=True)
    return df

@timed
def vectorize_output_tags(labels_df, input_df, target_cols = ['tag1', 'tag2', 'tag3']):
    """
    Vectorizes the tags in the input DataFrame based on the labels DataFrame
    INPUTS:
        labels_df: DataFrame containing list of possible tags
        input_df: DataFrame containing the input data to be vectorized
    OUTPUTS:
        total_output: List of lists where each inner list contains binary values indicating the presence of each tag
    """

    total_tags = labels_df['Tag'].to_list()
    total_output = []

    # iterating through each game row
    for index, row in input_df.iterrows():

        # removing blank tags and sorting
        tags = filter( None, [row['tag1'],  row['tag2'],  row['tag2']])
        tags = sorted(tags)

        row_output = []
        for tag in total_tags:
            if tag in tags:
                row_output.append(1)
            else:
                row_output.append(0)
        total_output.append(row_output)
    return total_output

@timed
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
            if token.pos_ == "NOUN" :  # Check if the token is a noun
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
    output_title = "common_noun_phrases: {column}".format(column=title_column)
    df[output_title] = df[title_column].apply(lambda x: get_common_noun_phrases(str(x)))
    return df

@timed
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


def text_to_lowercase(input_df:pd.DataFrame, column_name:str) -> pd.DataFrame:
    """
    Converts the specified column of a tags to lowercase

    Args:
        input_df (pd.DataFrame): The input DataFrame.
        column_name (str): The name of the column to convert to lowercase.

    Returns:
        pd.DataFrame: The DataFrame with the specified column converted to lowercase.
    """
    if column_name not in input_df.columns:
        raise ValueError(f"Column '{column_name}' not found in DataFrame.")
    
    output = []
    for values in input_df[column_name]:
        row_output = []
        # if list is not empty
        if values != row_output:
           for value in values:
                row_output.append(value.lower())
        output.append(row_output)
    input_df[column_name] = output
    return input_df

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


def filter_empty_rows(X, df):
    """
    Filters out rows in the DataFrame where all of 'tag1', 'tag2', and 'tag3' columns are NaN.
    Returns X and df filtered to only rows where at least one of these columns is not NaN.
    """
    # Boolean mask: True if all tag columns are NaN
    all_tags_nan = df[['tag1', 'tag2', 'tag3']].isna().all(axis=1)
    # We want rows where at least one tag is NOT NaN
    not_all_tags_nan = ~all_tags_nan
    return X[not_all_tags_nan.values], np.array(df[not_all_tags_nan]['vectorized_output'].to_list())


def force_min_tags(proba_matrix, min_tags=2, threshold=0.5):
    preds = np.zeros_like(proba_matrix, dtype=int)
    for i, row in enumerate(proba_matrix):
        # Get indices where probability exceeds threshold
        above_thresh = np.where(row >= threshold)[0]
        if len(above_thresh) >= min_tags:
            preds[i, above_thresh] = 1
        else:
            # Force top N predictions to 1
            top_indices = np.argsort(row)[-min_tags:]
            preds[i, top_indices] = 1
    return preds


def convert_predictions_to_text(predictions, labels_df, nonzero_cols):
    """
    Converts the binary predictions back to text labels using nonzero_cols to map indices.
    """
    text_predictions = []
    print(labels_df.columns)
    for pred in predictions:
        # Find indices where prediction is 1, map back to original label indices
        tag_indices = np.array(nonzero_cols)[pred == 1]

        tags = labels_df.loc[tag_indices, 'Tag'].tolist()
        text_predictions.append(tags)
    return text_predictions