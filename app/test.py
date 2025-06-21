
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
table_name = "optigame_user_games"

# returning data from the database
df = my_db_handler.retrieve_all_from_table(table_name)
print(df.head(5))