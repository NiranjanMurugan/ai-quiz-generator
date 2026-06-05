@echo off
cd /d "%~dp0"
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm.cmd install
)
echo.
echo Stop any old server first (Ctrl+C in other terminals).
echo If port 8080 is busy, close the other app or run: set PORT=5500 ^& node server.js
echo.
echo Starting Quizly API + app at http://localhost:8080
echo Health check: http://localhost:8080/api/health
echo.
node server.js
