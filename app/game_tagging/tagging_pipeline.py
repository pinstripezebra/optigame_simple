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
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from utils.db_handler import DatabaseHandler
import uuid
# custpom imports
from tagging_utils import vectorize_output_tags, extract_common_noun_phrases_with_numbers, drop_special_characters, lemmatize_common_noun_phrases, eliminate_shorter_subtags, filter_empty_rows, force_min_tags, convert_predictions_to_text


# creating database handler instance
my_db_handler = DatabaseHandler()
table_name = "optigame_products"


current_dir = os.path.dirname(__file__)
parent_dir = os.path.dirname(current_dir) + '/raw_data/'
df = pd.read_excel(parent_dir + 'manual_game_tagging.xlsx', sheet_name = 'tagged_games')[['id','asin','title', 'description', 'tag1', 'tag2', 'tag3']]
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

X_train, y_train = filter_empty_rows(X, df_with_nouns)


# Identify columns to drop (nonzero_cols)
zero_cols = np.where(y_train.sum(axis=0) == 0)[0]
nonzero_cols = np.where(y_train.sum(axis=0) > 0)[0]
y_train = y_train[:, nonzero_cols]


# -------------------------------------------#
# -----------------Modeling------------------#
# -------------------------------------------#
base_classifier = RandomForestClassifier(class_weight="balanced", n_estimators=100, random_state=42, max_depth=6)
model = MultiOutputClassifier(base_classifier).fit(X_train, y_train)

# predicting probabilities on train and test sets
predictions = model.predict_proba(X)


# converting probabalities to a matrix
probability_matrix= np.column_stack([p[:, 1] for p in predictions])


# Converting probabilities to binary predictions
train_predictions = force_min_tags(probability_matrix, min_tags=3, threshold=0.5)


# Converting predictions back to text
train_predictions_text = convert_predictions_to_text(train_predictions, labels_df, nonzero_cols)

print("Train Predictions (text):", train_predictions_text[:5])


#-------------------------------------#
#------Generating Output--------------#
#-------------------------------------#
X_train_df = pd.DataFrame(X_train.toarray(), columns=vectorizer.get_feature_names_out())


# Add predictions as new columns
df['predicted_tags'] = train_predictions_text
output_df = df[['asin', 'predicted_tags']]
output_df = output_df.dropna(subset=['asin','predicted_tags'])

# pivoting dataframe
output_df = output_df.explode('predicted_tags')
output_df['id'] = [uuid.uuid4() for _ in range(len(output_df))]
output_df = output_df.rename(columns={'predicted_tags': 'game_tags'})
output_df.to_csv(parent_dir + 'test.csv', index=False)
print(output_df.head(5))
#-------------------------------#
#PART 2: Creating new table and populating it with tagged data
#-------------------------------#

tag_table_name = "optigame_game_tags"
tag_table_creation_query = """CREATE TABLE IF NOT EXISTS optigame_game_tags (
    id UUID PRIMARY KEY,
    asin VARCHAR(255),
    game_tags TEXT
        )
    """
# deleting the table if it exists
my_db_handler.delete_table(tag_table_name)

# creating tag table if it doesn't exist
my_db_handler.create_table(tag_table_creation_query)

# Populate the table with data from the DataFrame
my_db_handler.populate_game_tags_table(output_df)

# returning data from the database
out_df = my_db_handler.retrieve_all_from_table(tag_table_name)


#-------------------------------#
#PART 3: Creating unique tags table and populating it with unique game tags
#-------------------------------#

unique_tag_table_name = "optigame_unique_game_tags"
unique_tag_table_creation_query = """CREATE TABLE IF NOT EXISTS optigame_unique_game_tags (
    id UUID PRIMARY KEY,
    game_tags TEXT UNIQUE
        )
    """

# deleting the table if it exists
my_db_handler.delete_table(unique_tag_table_name)

# creating unique tag table if it doesn't exist
my_db_handler.create_table(unique_tag_table_creation_query)

# Extract unique game tags from the DataFrame
unique_game_tags = output_df["game_tags"].drop_duplicates().reset_index(drop=True)
unique_game_tags_df = unique_game_tags.to_frame(name="game_tags")
unique_game_tags_df["id"] = [uuid.uuid4() for _ in range(len(unique_game_tags_df))]

# ensuring columns are in correct order
unique_game_tags_df = unique_game_tags_df[["id", "game_tags"]]

# Populate the table with data from the unique game tags DataFrame
my_db_handler.populate_unique_game_tags_table(unique_game_tags_df)

# returning data from the database
unique_out_df = my_db_handler.retrieve_all_from_table(unique_tag_table_name)
