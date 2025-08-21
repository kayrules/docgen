#!/bin/bash

echo "🛑 Stopping Docusaurus frontend..."

# Stop Docusaurus processes
echo "Stopping Docusaurus processes..."
pkill -f "docusaurus serve" 2>/dev/null
pkill -f "npm run serve" 2>/dev/null

# Kill processes on port 3000
echo "Stopping processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Additional cleanup
pkill -f "node.*docusaurus" 2>/dev/null

# Wait for processes to fully stop
sleep 2

echo "✅ Docusaurus frontend stopped."