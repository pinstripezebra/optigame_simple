import os

# third party imports
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multioutput import MultiOutputClassifier
import pandas as pd
import numpy as np
import spacy
from sklearn.metrics import hamming_loss

# custpom imports
from tagging_utils import vectorize_output_tags, extract_common_noun_phrases_with_numbers, text_to_lowercase

current_dir = os.path.dirname(__file__)
parent_dir = os.path.dirname(current_dir) + '/raw_data/'
df = pd.read_excel(parent_dir + 'manual_game_tagging.xlsx', sheet_name = 'tagged_games')[['title', 'description', 'tag1', 'tag2', 'tag3']]
labels_df = pd.read_excel(parent_dir + 'manual_game_tagging.xlsx', sheet_name = 'tags')


# ------------------------- #
# -------Vectorizing Y------#
# ------------------------- #
df['vectorized_output'] = vectorize_output_tags(labels_df, df)


# ------------------------- #
# -------Vectorizing X------#
# ------------------------- #
# Will use description as x
nlp = spacy.load("en_core_web_sm")
df_with_nouns = extract_common_noun_phrases_with_numbers(nlp, df, "description")
df_with_nouns = extract_common_noun_phrases_with_numbers(nlp, df, "title")

# Combine the noun phrases from both columns into a single column and lemmatize them
df_with_nouns['combined_phrases'] = [x + y for x, y in zip(df_with_nouns['common_noun_phrases: description'], df_with_nouns['common_noun_phrases: title'])]
df_with_nouns = text_to_lowercase(df_with_nouns, "combined_phrases")
df_with_nouns = df_with_nouns.drop(columns=['common_noun_phrases: description', 'common_noun_phrases: title'], axis=1)


# converting counts to text vector
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df_with_nouns['combined_phrases'].astype(str))

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

X, y = filter_empty_rows(X, df_with_nouns)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# dropping zero columns from y_train and y_test - these are tags that are not present in the train or test data
zero_cols = np.where(y_train.sum(axis=0) == 0)[0]
nonzero_cols = np.where(y_train.sum(axis=0) > 0)[0]
y_train = y_train[:, nonzero_cols]
y_test = y_test[:, nonzero_cols]

# training model
model = MultiOutputClassifier(LogisticRegression()).fit(X_train, y_train)

# making predictions
train_predictions = model.predict(X_train)
test_predictions = model.predict(X_test)

# evaluation model performance
hamming_loss_score_test = hamming_loss(y_test, test_predictions)
hamming_loss_score_train = hamming_loss(y_train, train_predictions)
print(f"Hamming Loss test: {hamming_loss_score_test}")
print(f"Hamming Loss train: {hamming_loss_score_train}")
