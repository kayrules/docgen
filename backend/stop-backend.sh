#!/bin/bash

echo "🛑 Stopping DocuPilot backend..."

# Stop backend processes
echo "Stopping backend processes..."
pkill -f "bun --hot server.js" 2>/dev/null
pkill -f "npm run bun:dev" 2>/dev/null

# Kill processes on port 3001
echo "Stopping processes on port 3001..."
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Additional cleanup
pkill -f "bun.*server.js" 2>/dev/null

# Wait for processes to fully stop
sleep 2

echo "✅ Backend server stopped."