#!/bin/bash

# Strength Tracker - Setup Verification Script
# This script verifies all dependencies and configurations are correct

set -e

echo "🔍 Strength Tracker - Setup Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0

# Function to check if command exists
check_command() {
  if command -v $1 &> /dev/null; then
    echo -e "${GREEN}✓${NC} $1 is installed"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} $1 is NOT installed"
    ((FAILED++))
    return 1
  fi
}

# Function to check file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 exists"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} $1 NOT found"
    ((FAILED++))
    return 1
  fi
}

# Function to check directory exists
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 exists"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} $1 NOT found"
    ((FAILED++))
    return 1
  fi
}

echo "📦 Checking System Dependencies..."
echo "-----------------------------------"
check_command "node"
check_command "npm"
check_command "psql"

echo ""
echo "📁 Checking Project Structure..."
echo "-----------------------------------"
check_dir "backend"
check_dir "frontend"
check_dir "backend/src"
check_dir "frontend/src"

echo ""
echo "🔧 Checking Backend Files..."
echo "-----------------------------------"
check_file "backend/package.json"
check_file "backend/.env.example"
check_file "backend/src/server.js"
check_file "backend/src/config/database.js"
check_file "backend/src/config/passport.js"
check_file "backend/src/models/User.js"
check_file "backend/src/models/Workout.js"
check_file "backend/src/models/Friend.js"
check_file "backend/src/routes/auth.js"
check_file "backend/src/routes/workouts.js"
check_file "backend/src/routes/friends.js"
check_file "backend/src/controllers/authController.js"
check_file "backend/src/controllers/workoutController.js"
check_file "backend/src/controllers/friendController.js"
check_file "backend/src/middleware/auth.js"
check_file "backend/src/migrations/init.sql"
check_file "backend/src/migrations/seedExercises.sql"

echo ""
echo "📱 Checking Frontend Files..."
echo "-----------------------------------"
check_file "frontend/package.json"
check_file "frontend/App.js"
check_file "frontend/app.json"
check_file "frontend/src/api/client.js"
check_file "frontend/src/screens/LogWorkoutScreen.js"
check_file "frontend/src/screens/WorkoutsScreen.js"
check_file "frontend/src/screens/LeaderboardScreen.js"
check_file "frontend/src/screens/FriendsScreen.js"
check_file "frontend/src/screens/ProfileScreen.js"
check_file "frontend/src/navigation/AuthNavigator.js"
check_file "frontend/src/navigation/AppNavigator.js"

echo ""
echo "📚 Checking Documentation..."
echo "-----------------------------------"
check_file "README.md"
check_file "QUICKSTART.md"
check_file "DEVELOPMENT.md"
check_file "API_DOCS.md"
check_file "GAMIFICATION.md"
check_file "ARCHITECTURE.md"

echo ""
echo "🔐 Checking Backend Environment Setup..."
echo "-----------------------------------"
if [ -f "backend/.env" ]; then
  echo -e "${GREEN}✓${NC} backend/.env exists"
  ((PASSED++))
  
  # Check required keys
  if grep -q "DB_HOST" backend/.env; then
    echo -e "${GREEN}✓${NC} DB_HOST configured"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠${NC} DB_HOST not configured"
    ((FAILED++))
  fi
  
  if grep -q "JWT_SECRET" backend/.env; then
    echo -e "${GREEN}✓${NC} JWT_SECRET configured"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠${NC} JWT_SECRET not configured"
    ((FAILED++))
  fi
else
  echo -e "${YELLOW}⚠${NC} backend/.env not found (run: cp backend/.env.example backend/.env)"
  ((FAILED++))
fi

echo ""
echo "📱 Checking Frontend Environment Setup..."
echo "-----------------------------------"
if [ -f "frontend/.env" ]; then
  echo -e "${GREEN}✓${NC} frontend/.env exists"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} frontend/.env not found (should contain EXPO_PUBLIC_API_URL)"
  ((FAILED++))
fi

echo ""
echo "📊 Checking PostgreSQL..."
echo "-----------------------------------"
if pg_isready -h localhost &>/dev/null; then
  echo -e "${GREEN}✓${NC} PostgreSQL is running"
  ((PASSED++))
  
  # Check if database exists
  if psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw strength_tracker; then
    echo -e "${GREEN}✓${NC} strength_tracker database exists"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠${NC} strength_tracker database not found (run migration)"
    ((FAILED++))
  fi
else
  echo -e "${RED}✗${NC} PostgreSQL is NOT running"
  echo "  Start with: brew services start postgresql (macOS)"
  echo "            sudo service postgresql start (Linux)"
  ((FAILED++))
fi

echo ""
echo "📦 Checking Backend Dependencies..."
echo "-----------------------------------"
if [ -d "backend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} backend/node_modules exists"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} backend/node_modules not found (run: npm install -w backend)"
  ((FAILED++))
fi

echo ""
echo "📦 Checking Frontend Dependencies..."
echo "-----------------------------------"
if [ -d "frontend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} frontend/node_modules exists"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} frontend/node_modules not found (run: npm install -w frontend)"
  ((FAILED++))
fi

echo ""
echo "========================================"
echo "📋 Verification Summary"
echo "========================================"
echo -e "${GREEN}✓ Passed:${NC} $PASSED"
echo -e "${RED}✗ Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✨ All checks passed! You're ready to start development.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Terminal 1: cd backend && npm run dev"
  echo "2. Terminal 2: cd frontend && npm start"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some checks failed. Please review the items above.${NC}"
  echo ""
  echo "Common fixes:"
  echo "  • Install dependencies: npm run install-all"
  echo "  • Create databases: createdb strength_tracker"
  echo "  • Run migrations: psql strength_tracker < backend/src/migrations/init.sql"
  echo "  • Setup .env files: cp backend/.env.example backend/.env"
  exit 1
fi
