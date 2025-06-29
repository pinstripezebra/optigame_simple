import os

# third party imports
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
import pandas as pd
import numpy as np
import spacy
from sklearn.metrics import hamming_loss

# custpom imports
from tagging_utils import vectorize_output_tags, extract_common_noun_phrases_with_numbers, drop_special_characters, lemmatize_common_noun_phrases, eliminate_shorter_subtags, filter_empty_rows, force_min_tags, convert_predictions_to_text


current_dir = os.path.dirname(__file__)
parent_dir = os.path.dirname(current_dir) + '/raw_data/'
df = pd.read_excel(parent_dir + 'manual_game_tagging.xlsx', sheet_name = 'tagged_games')[['title', 'description', 'tag1', 'tag2', 'tag3']]
df = df.reset_index().rename(columns={'index': 'orig_index'})
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

# Dropping special characters from description and title
df = drop_special_characters(df, "description")
df = drop_special_characters(df, "title")

# Extracting common noun phrases from description and title
df_with_nouns = extract_common_noun_phrases_with_numbers(nlp, df, "description")
df_with_nouns = extract_common_noun_phrases_with_numbers(nlp, df_with_nouns, "title")

# Combine the noun phrases from both columns into a single column and lemmatize them
df_with_nouns['combined_phrases'] = [x + y for x, y in zip(df_with_nouns['common_noun_phrases: description'], df_with_nouns['common_noun_phrases: title'])]

# lemantizing
df_with_nouns = lemmatize_common_noun_phrases(nlp, df_with_nouns, "combined_phrases")
df_with_nouns = df_with_nouns.drop(columns=['common_noun_phrases: description', 'common_noun_phrases: title'], axis=1)

# eliminating shorter substrings
df_with_nouns = eliminate_shorter_subtags(df_with_nouns, "combined_phrases")

# converting counts to text vector
# Only including phrases that appear at least 5 times in the dataset
vectorizer = TfidfVectorizer(min_df=7)
X = vectorizer.fit_transform(df_with_nouns['combined_phrases'].astype(str))
print(f"Shape of X: {X.shape}")

X, y = filter_empty_rows(X, df_with_nouns)
print(f"Shape of X, post filter: {X.shape}")
print(f"Shape of y, post filter: {y.shape}")

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# Identify columns to drop (nonzero_cols)
zero_cols = np.where(y_train.sum(axis=0) == 0)[0]
nonzero_cols = np.where(y_train.sum(axis=0) > 0)[0]
y_train = y_train[:, nonzero_cols]
y_test = y_test[:, nonzero_cols]
print('Non-zero columns:', nonzero_cols)

# -------------------------------------------#
# -----------------Modeling------------------#
# -------------------------------------------#
base_classifier = RandomForestClassifier(class_weight="balanced", n_estimators=100, random_state=42, max_depth=6)
model = MultiOutputClassifier(base_classifier).fit(X_train, y_train)

# predicting probabilities on train and test sets
train_predictions = model.predict_proba(X_train)
test_predictions = model.predict_proba(X_test)

# converting probabalities to a matrix
probability_matrix_train= np.column_stack([p[:, 1] for p in train_predictions])
probability_matrix_test= np.column_stack([p[:, 1] for p in test_predictions])

# Converting probabilities to binary predictions
train_predictions = force_min_tags(probability_matrix_train, min_tags=3, threshold=0.5)
test_predictions = force_min_tags(probability_matrix_test, min_tags=3, threshold=0.5)
print('Train Shape post transform:', train_predictions.shape)

# evaluation model performance
hamming_loss_score_test = hamming_loss(y_test, test_predictions)
hamming_loss_score_train = hamming_loss(y_train, train_predictions)
print(f"Hamming Loss test: {hamming_loss_score_test}")
print(f"Hamming Loss train: {hamming_loss_score_train}")


# Converting predictions back to text
train_predictions_text = convert_predictions_to_text(train_predictions, labels_df, nonzero_cols)
test_predictions_text = convert_predictions_to_text(test_predictions, labels_df, nonzero_cols)

print("Train Predictions (text):", train_predictions_text[:5])
print("Test Predictions (text):", test_predictions_text[:5])

#-------------------------------------#
#------Generating Output--------------#
#-------------------------------------#
X_train_df = pd.DataFrame(X_train.toarray(), columns=vectorizer.get_feature_names_out())
X_test_df = pd.DataFrame(X_test.toarray(), columns=vectorizer.get_feature_names_out())

# Add predictions as new columns
X_train_df['predicted_tags'] = train_predictions_text
X_test_df['predicted_tags'] = test_predictions_text

# Add a column to indicate train/test split
X_train_df['split'] = 'train'
X_test_df['split'] = 'test'

# Concatenate into one output DataFrame
output_df = pd.concat([X_train_df, X_test_df], ignore_index=True)
output_df.to_excel(parent_dir + 'test.xlsx', index=False)
