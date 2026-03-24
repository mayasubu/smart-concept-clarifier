@echo off
echo ================================
echo  Smart Concept Clarifier Startup
echo ================================
echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm install && node server.js"
timeout /t 3
echo.
echo Starting Frontend React App...
start cmd /k "cd frontend && npm install && npm start"
echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause
