#!/bin/bash

echo "🚀 Starting DocuPilot backend..."

# Function to check if port is in use
check_port() {
    lsof -ti:$1 >/dev/null 2>&1
}

# Stop any existing backend processes
echo "Stopping existing backend processes..."
pkill -f "bun --hot server.js" 2>/dev/null
pkill -f "npm run bun:dev" 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Wait for cleanup
sleep 2

# Start backend server
echo "Starting backend server on port 3001..."
npm run bun:dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if check_port 3001; then
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    echo ""
    echo "🔧 Backend: http://localhost:3001"
    echo "📋 Health:  http://localhost:3001/health"
    echo ""
    echo "Press Ctrl+C to stop backend service"
    
    # Wait for user to stop service
    wait
else
    echo "❌ Failed to start backend server"
    exit 1
fi