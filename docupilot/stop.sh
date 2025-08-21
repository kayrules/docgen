#!/bin/bash

echo "🛑 Stopping DocuPilot services..."

# Function to kill processes on specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "Stopping processes on port $port..."
        echo $pids | xargs kill -9 2>/dev/null
        sleep 1
    fi
}

# Stop specific processes
echo "Stopping Docusaurus processes..."
pkill -f "docusaurus serve" 2>/dev/null
pkill -f "bun serve" 2>/dev/null
pkill -f "npm run serve" 2>/dev/null

echo "Stopping backend processes..."
pkill -f "bun --hot server.js" 2>/dev/null
pkill -f "npm run bun:dev" 2>/dev/null

# Kill processes by port
kill_port 3000  # Frontend
kill_port 3001  # Backend

# Additional cleanup
pkill -f "node.*docusaurus" 2>/dev/null
pkill -f "bun.*server.js" 2>/dev/null

# Wait for processes to fully stop
sleep 2

echo "✅ All DocuPilot services stopped."