from sklearn.multioutput import MultiOutputClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import os

current_dir = os.path.dirname(__file__)
parent_dir = os.path.dirname(current_dir) + '/raw_data/'

df = pd.read_excel(parent_dir + 'manual_game_tagging.xlsx', sheet_name = 'tagged_games')[['title', 'description', 'tag1', 'tag2', 'tag3']]
labels_df = pd.read_excel(parent_dir + 'manual_game_tagging.xlsx', sheet_name = 'tags')
print(labels_df)

def vectorize_tags

#print(df.head(10))
# can use a multioutput classifier


# Sample Data
texts = ["This is a good movie.", "The movie was terrible.", "I love this restaurant.", "The food was amazing."]
labels = [["movie", "positive"], ["movie", "negative"], ["restaurant", "positive"], ["restaurant", "positive"]]

# Convert labels to binary format
from sklearn.preprocessing import MultiLabelBinarizer
mlb = MultiLabelBinarizer()
binary_labels = mlb.fit_transform(labels)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(texts, binary_labels, test_size=0.2, random_state=42)

# Vectorize text data using TF-IDF
vectorizer = TfidfVectorizer()
X_train_vectorized = vectorizer.fit_transform(X_train)
X_test_vectorized = vectorizer.transform(X_test)

'''
# Train a Logistic Regression model with OneVsRest
model = OneVsRestClassifier(LogisticRegression())
model.fit(X_train_vectorized, y_train)

# Make predictions
predictions = model.predict(X_test_vectorized)

# Evaluate the model (e.g., using Hamming Loss)
from sklearn.metrics import hamming_loss
hamming_loss_score = hamming_loss(y_test, predictions)
print(f"Hamming Loss: {hamming_loss_score}")

# Example: Get predicted labels for a single text
new_text = "The food was delicious."
new_text_vectorized = vectorizer.transform([new_text])
predicted_labels = model.predict(new_text_vectorized)

# Convert back to original label format (if needed)
predicted_labels_original = mlb.inverse_transform(predicted_labels)

print(f"Predicted labels: {predicted_labels_original}")
'''