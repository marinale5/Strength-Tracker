#!/bin/bash

# Strength Tracker - Automated Setup Script
# This script sets up both backend and frontend for local development

set -e

echo ""
echo "🚀 Strength Tracker - Automated Setup"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 16+: https://nodejs.org/"
  exit 1
fi

echo "✅ Node.js $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  echo "❌ PostgreSQL not found. Please install PostgreSQL 12+:"
  echo "   macOS: brew install postgresql"
  echo "   Ubuntu: sudo apt-get install postgresql"
  echo "   Windows: https://www.postgresql.org/download/"
  exit 1
fi

echo "✅ PostgreSQL $(psql --version | awk '{print $3}')"

# Check root directory structure
if [ ! -f "package.json" ]; then
  echo "❌ Run this script from the Strength-Tracker root directory"
  exit 1
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "🗄️  Setting up Database..."

# Check if database exists
if psql -h localhost -U postgres -d strength_tracker -c "SELECT 1" &> /dev/null; then
  echo "⚠️  Database already exists. Skipping initialization."
else
  echo "Creating database..."
  createdb strength_tracker 2>/dev/null || true
  
  echo "Running migrations..."
  psql strength_tracker < backend/src/migrations/init.sql
  
  echo "Seeding exercises..."
  psql strength_tracker < backend/src/migrations/seedExercises.sql
  
  echo "✅ Database initialized"
fi

echo ""
echo "⚙️  Backend Configuration..."

# Check if .env exists
if [ ! -f "backend/.env" ]; then
  echo "Creating .env file..."
  cp backend/.env.example backend/.env
  echo "✅ .env file created (edit with your OAuth credentials)"
else
  echo "✅ .env file exists"
fi

echo ""
echo "⚙️  Frontend Configuration..."

# Check if .env exists
if [ ! -f "frontend/.env" ]; then
  echo "Creating .env file..."
  echo "EXPO_PUBLIC_API_URL=http://localhost:5000" > frontend/.env
  echo "✅ .env file created"
else
  echo "✅ .env file exists"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Edit OAuth Credentials (optional for local dev):"
echo "   nano backend/.env"
echo ""
echo "2. Start Development Servers:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm start"
echo "   Then press 'i' for iOS or 'a' for Android"
echo ""
echo "📱 App will be available at localhost:19000"
echo ""
echo "📚 Documentation: See QUICKSTART.md for more details"
echo ""
