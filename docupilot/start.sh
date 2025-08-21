#!/bin/bash

echo "🚀 Starting DocuPilot (Frontend + Backend)..."

# Function to check if port is in use
check_port() {
    lsof -ti:$1 >/dev/null 2>&1
}

# Stop any existing processes
echo "Stopping existing processes..."
./stop.sh >/dev/null 2>&1

# Wait for cleanup
sleep 2

# Start backend server
echo "Starting backend server on port 3001..."
cd ../backend
./start-backend.sh &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if check_port 3001; then
    echo "✅ Backend server started"
else
    echo "❌ Failed to start backend server"
    exit 1
fi

# Return to docupilot directory
cd ../docupilot

# Start frontend
echo "Starting Docusaurus frontend..."
./start-frontend.sh &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

# Check if frontend started successfully
if check_port 3000; then
    echo "✅ Docusaurus frontend started"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend:  http://localhost:3001"
    echo "📋 Health:   http://localhost:3001/health"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for user to stop services
    wait
else
    echo "❌ Failed to start Docusaurus frontend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi