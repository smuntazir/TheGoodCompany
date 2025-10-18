#!/bin/bash

# Exit on any error
set -e

echo "Starting deployment..."

# Build the React frontend if build folder doesn't exist
if [ ! -d "client/build" ]; then
    echo "Building React frontend..."
    cd client
    npm install
    npm run build
    cd ..
else
    echo "Build folder already exists, skipping build..."
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Start the Flask application
echo "Starting Flask server on port ${PORT:-8080}..."
python app.py
