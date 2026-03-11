#!/bin/bash

echo "========================================="
echo "Starting BCM Frontend Application"
echo "========================================="
echo ""

cd bia-module

echo "Checking Node.js version..."
node --version
echo ""

echo "Checking npm version..."
npm --version
echo ""

echo "Checking if node_modules exists..."
if [ -d "node_modules" ]; then
    echo "✓ node_modules directory found"
else
    echo "✗ node_modules directory not found"
    echo "Running npm install..."
    npm install
fi
echo ""

echo "Starting Next.js development server..."
echo "The application will be available at: http://localhost:3000"
echo ""

npm run dev

