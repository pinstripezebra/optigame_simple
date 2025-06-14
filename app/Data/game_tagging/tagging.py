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
from tagging_utils import vectorize_output_tags, extract_common_noun_phrases_with_numbers, text_to_lowercase, lemmatize_common_noun_phrases, eliminate_shorter_subtags

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

# lemantizing
df_with_nouns = lemmatize_common_noun_phrases(nlp, df_with_nouns, "combined_phrases")
df_with_nouns = df_with_nouns.drop(columns=['common_noun_phrases: description', 'common_noun_phrases: title'], axis=1)

# eliminating shorter substrings
df_with_nouns = eliminate_shorter_subtags(df_with_nouns, "combined_phrases")

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
print(f"Shape of X: {X.shape}")
print(f"Shape of y: {y.shape}")

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# Identify columns to drop (nonzero_cols)
zero_cols = np.where(y_train.sum(axis=0) == 0)[0]
nonzero_cols = np.where(y_train.sum(axis=0) > 0)[0]
y_train = y_train[:, nonzero_cols]
y_test = y_test[:, nonzero_cols]
print('Non-zero columns:', nonzero_cols)

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


# Converting predictions back to text
def convert_predictions_to_text(predictions, labels_df, nonzero_cols):
    """
    Converts the binary predictions back to text labels using nonzero_cols to map indices.
    """
    text_predictions = []
    for pred in predictions:
        # Find indices where prediction is 1, map back to original label indices
        tag_indices = np.array(nonzero_cols)[pred == 1]
        tags = labels_df.loc[tag_indices, 'tag'].tolist()
        text_predictions.append(tags)
    return text_predictions

train_predictions_text = convert_predictions_to_text(train_predictions, labels_df, nonzero_cols)
test_predictions_text = convert_predictions_to_text(test_predictions, labels_df, nonzero_cols)

print("Train Predictions (text):", train_predictions_text[:5])
print("Test Predictions (text):", test_predictions_text[:5])
