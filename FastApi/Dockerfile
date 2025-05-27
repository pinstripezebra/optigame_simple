FROM python:3.13-slim

# Set the working directory
WORKDIR /app

# install system requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# starting app
CMD uvicorn main:app