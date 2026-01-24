#!/bin/bash

# Exit on any error
set -e

echo "🏗️  Starting Production Build..."

# 1. Build Frontend
echo "📦 Building Frontend..."
cd client
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run build
cd ..

# 2. Install Backend Dependencies
# Digital Ocean/Heroku buildpacks usually look for requirements.txt, but running this explicitely
# ensures that the environment is fully prepared if we are using a custom build command.
echo "🐍 Installing Backend Dependencies..."
pip install -r requirements.txt

echo "✅ Build Complete! Ready for start."
