#!/bin/bash

echo "🚀 Starting Docusaurus frontend..."

# Function to check if port is in use
check_port() {
    lsof -ti:$1 >/dev/null 2>&1
}

# Stop any existing Docusaurus processes
echo "Stopping existing Docusaurus processes..."
pkill -f "docusaurus serve" 2>/dev/null
pkill -f "npm run serve" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Wait for cleanup
sleep 2

# Build and serve frontend
echo "Building and serving Docusaurus..."
npm run build && npm run serve &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Check if frontend started successfully
if check_port 3000; then
    echo "✅ Docusaurus frontend started (PID: $FRONTEND_PID)"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop frontend service"
    
    # Wait for user to stop service
    wait
else
    echo "❌ Failed to start Docusaurus frontend"
    exit 1
fi