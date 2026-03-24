#!/bin/bash
echo "================================"
echo " Smart Concept Clarifier Startup"
echo "================================"
echo ""
echo "Installing backend dependencies..."
cd backend && npm install
echo ""
echo "Starting backend server in background..."
node server.js &
BACKEND_PID=$!
echo "Backend running (PID: $BACKEND_PID)"
echo ""
cd ../frontend
echo "Installing frontend dependencies..."
npm install
echo ""
echo "Starting React frontend..."
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
