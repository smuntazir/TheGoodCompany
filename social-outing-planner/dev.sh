#!/bin/bash

# Social Outing Planner - Development Startup Script
# This script starts both the Python backend and React frontend in development mode.

# Exit on error
set -e

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "👋 Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "🚀 Starting Development Environment..."

# 1. Setup Python Environment
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "✅ Python environment activated"

# Install Python requirements if needed
if [ -f "requirements.txt" ]; then
    echo "📦 Checking Python dependencies..."
    pip install -r requirements.txt > /dev/null
fi

# 2. Setup Node Environment
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies (this may take a moment)..."
    cd client
    npm install
    cd ..
fi

echo "✨ Starting Servers..."

# Start Backend in background
# We use BACKEND_PORT to avoid system/React PORT conflicts
echo "🟢 Backend: http://localhost:5001"
export BACKEND_PORT=5001
export FLASK_DEBUG=true
source venv/bin/activate
python3 app.py &
BACKEND_PID=$!

# Start Frontend
echo "🔵 Frontend: http://localhost:3000"
cd client
echo "Starting React..."
# React scripts will automatically use PORT=3000 by default or via .env
export HOST=0.0.0.0
npm start

# Wait for backend to finish (which it shouldn't unless error)
wait $BACKEND_PID
