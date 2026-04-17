@echo off
REM Strength Tracker - Automated Setup Script (Windows)
REM This script sets up both backend and frontend for local development

echo.
echo 🚀 Strength Tracker - Automated Setup
echo =====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
  echo ❌ Node.js not found. Please install Node.js 16+: https://nodejs.org/
  pause
  exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
  echo ❌ npm not found. Please install Node.js which includes npm.
  pause
  exit /b 1
)

echo.
echo 📦 Installing Backend Dependencies...
cd backend
call npm install
echo ✅ Backend dependencies installed

echo.
echo 📦 Installing Frontend Dependencies...
cd ..\frontend
call npm install
echo ✅ Frontend dependencies installed

cd ..

echo.
echo ⚙️ Backend Configuration...

if not exist "backend\.env" (
  echo Creating .env file...
  copy backend\.env.example backend\.env
  echo ✅ .env file created (edit with your OAuth credentials)
) else (
  echo ✅ .env file exists
)

echo.
echo ⚙️ Frontend Configuration...

if not exist "frontend\.env" (
  echo Creating .env file...
  (
    echo EXPO_PUBLIC_API_URL=http://localhost:5000
  ) > frontend\.env
  echo ✅ .env file created
) else (
  echo ✅ .env file exists
)

echo.
echo ✅ Setup Complete!
echo.
echo 🎯 Next Steps:
echo.
echo 1. Start PostgreSQL (if not already running)
echo.
echo 2. Create Database (run in PowerShell or Command Prompt):
echo    createdb strength_tracker
echo.
echo 3. Initialize Database:
echo    psql strength_tracker ^< backend\src\migrations\init.sql
echo    psql strength_tracker ^< backend\src\migrations\seedExercises.sql
echo.
echo 4. Start Development Servers:
echo.
echo    Terminal 1 (Backend):
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend
echo    npm start
echo    Then press 'i' for iOS or 'a' for Android
echo.
echo 📱 App will be available at localhost:19000
echo.
echo 📚 Documentation: See QUICKSTART.md for more details
echo.
pause
