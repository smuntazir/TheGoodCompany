#!/bin/bash

echo "Building React frontend..."
cd client
npm install
npm run build
cd ..

echo "Build complete! Frontend built to client/build/"
