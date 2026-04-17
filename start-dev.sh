#!/bin/bash

# Strength Tracker - Quick Start Script
# This script sets up and starts the development environment

set -e

echo "🚀 Strength Tracker - Quick Start"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run command in new terminal (macOS)
run_in_terminal_mac() {
  osascript -e "tell app \"Terminal\" to do script \"$1\""
}

# Function to print section
print_section() {
  echo ""
  echo -e "${BLUE}$1${NC}"
  echo "---"
}

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
  IS_MAC=true
else
  IS_MAC=false
fi

# Step 1: Install dependencies
print_section "📦 Installing Dependencies"

if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd backend
  npm install
  cd ..
  echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
  echo -e "${GREEN}✓${NC} Backend dependencies already installed"
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  cd ..
  echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
  echo -e "${GREEN}✓${NC} Frontend dependencies already installed"
fi

# Step 2: Check/Setup Environment variables
print_section "🔐 Setting up Environment Variables"

if [ ! -f "backend/.env" ]; then
  echo "Creating backend/.env from template..."
  cp backend/.env.example backend/.env
  echo -e "${YELLOW}⚠${NC} Updated backend/.env - Please check the values!"
else
  echo -e "${GREEN}✓${NC} backend/.env exists"
fi

if [ ! -f "frontend/.env" ]; then
  echo "Creating frontend/.env..."
  echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > frontend/.env
  echo -e "${GREEN}✓${NC} frontend/.env created"
else
  echo -e "${GREEN}✓${NC} frontend/.env exists"
fi

# Step 3: Setup Database (if needed)
print_section "🗄️  Database Setup"

if ! psql -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw strength_tracker; then
  echo -e "${YELLOW}Creating database...${NC}"
  createdb strength_tracker
  echo -e "${GREEN}✓${NC} Database created"
  
  echo "Initializing schema..."
  psql strength_tracker < backend/src/migrations/init.sql
  echo -e "${GREEN}✓${NC} Schema initialized"
  
  echo "Seeding exercises..."
  psql strength_tracker < backend/src/migrations/seedExercises.sql
  echo -e "${GREEN}✓${NC} Exercises seeded"
else
  echo -e "${GREEN}✓${NC} Database already exists"
fi

# Step 4: Start servers
print_section "🎮 Starting Development Servers"

if [ "$IS_MAC" = true ]; then
  echo "Starting backend in new terminal..."
  osascript <<EOF
tell app "Terminal"
  create window with default profile
  tell current session of result
    write text "cd $(pwd)/backend && npm run dev"
  end tell
end tell
EOF
  sleep 2
  
  echo "Starting frontend in new terminal..."
  osascript <<EOF
tell app "Terminal"
  create window with default profile
  tell current session of result
    write text "cd $(pwd)/frontend && npm start"
  end tell
end tell
EOF
  sleep 2
  
  echo -e "${GREEN}✓${NC} Servers starting in new terminals"
  echo ""
  echo -e "${BLUE}Backend${NC} will be available at: http://localhost:5000"
  echo -e "${BLUE}Frontend${NC} will be available at: http://localhost:19000"
  echo ""
  echo "Windows/Terminal:"
  echo "  • Press 'i' for iOS Simulator"
  echo "  • Press 'a' for Android Emulator"
  echo "  • Press 'w' for Web Browser"
  
else
  echo -e "${YELLOW}📋 Linux/WSL detected${NC}"
  echo ""
  echo "Run these commands in separate terminals:"
  echo ""
  echo -e "${BLUE}Terminal 1:${NC}"
  echo "  cd backend && npm run dev"
  echo ""
  echo -e "${BLUE}Terminal 2:${NC}"
  echo "  cd frontend && npm start"
  echo ""
  echo "Then press 'i', 'a', or 'w' for iOS, Android, or Web"
fi

print_section "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env files if needed"
echo "2. Set up OAuth credentials (Google, GitHub)"
echo "3. Test the app"
echo ""
echo "Documentation:"
echo "  • QUICKSTART.md - Quick start guide"
echo "  • DEVELOPMENT.md - Setup and troubleshooting"
echo "  • API_DOCS.md - API reference"
echo ""
echo "Good luck! 💪🎮"
