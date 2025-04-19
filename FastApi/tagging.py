
from dotenv import load_dotenv
import spacy
import uuid
from utils.db_handler import DatabaseHandler
from utils.nlp_parsing import extract_common_noun_phrases_with_numbers, lemmatize_common_noun_phrases
from utils.nlp_parsing import eliminate_shorter_subtags, filter_and_order_tags_by_frequency, add_game_tags_column


#-------------------------------#
#PART 1: Retrieving games data and tagging
#-------------------------------#

# creating database handler instance
my_db_handler = DatabaseHandler()
table_name = "optigame_products"

# returning data from the database
df = my_db_handler.retrieve_all_from_table(table_name)
column_of_interest = "title"

# Load the spaCy English model
nlp = spacy.load("en_core_web_sm")

# Extracting common nouns from the DataFrame
df_with_nouns = extract_common_noun_phrases_with_numbers(nlp, df, "title")

# Lemantizing extracted common nouns
df_with_lemmatized_nouns = lemmatize_common_noun_phrases(nlp, df_with_nouns, "common_noun_phrases")

# now eliminating shorter sub tags, i.e. if we have 'game' and 'board game' we keep 'board game'
df_with_collapsed_tags = eliminate_shorter_subtags(df_with_lemmatized_nouns, "common_noun_phrases")

# Now performing global filtering and ordering of tags by frequency
most_frequent_games = filter_and_order_tags_by_frequency(df_with_collapsed_tags,1 , "common_noun_phrases", "game")

# now adding frequent game tages back to base dataframe
game_tagged_df = add_game_tags_column(df_with_collapsed_tags, most_frequent_games, 
                                      common_noun_phrases_column= "common_noun_phrases")

# Conditionally fill 'game_tags' with ["game"] only if it is an empty list
game_tagged_df["game_tags"] = game_tagged_df["game_tags"].apply(lambda tags: ["game"] if tags == [] else tags)
game_tagged_df.drop(columns=["common_noun_phrases"], inplace=True)

# normalizing the game_tags column to be a string
game_tagged_df = game_tagged_df[['asin', 'game_tags']]
game_tagged_df_long = game_tagged_df.explode("game_tags")
game_tagged_df_long.reset_index(drop=True, inplace=True)
game_tagged_df_long['id'] = [uuid.uuid4() for _ in range(len(game_tagged_df_long))]
print(game_tagged_df_long.columns)
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

# creating tag table if it doesn't exist
my_db_handler.create_table(tag_table_creation_query)

# Populate the table with data from the DataFrame
my_db_handler.populate_game_tags_table(game_tagged_df_long)

# returning data from the database
out_df = my_db_handler.retrieve_all_from_table(tag_table_name)
print(out_df)