@echo off
echo Starting HookChat application...

:: Start server in a new window
start powershell -Command "cd '%~dp0server' ; npm start"

:: Start client in a new window
start powershell -Command "cd '%~dp0client' ; npm run dev"

echo HookChat started! Check the opened terminal windows for details.
echo Server running at http://localhost:3001
echo Client running at http://localhost:5173 or http://localhost:5174 