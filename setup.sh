#!/bin/bash

# TARS Voice App - Quick Setup Script
# This script will set up both backend and frontend

echo "🤖 TARS Voice Conversation App - Setup Script"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check for API keys
echo "📋 API Keys Check"
echo "-----------------"
echo "You will need:"
echo "  1. OpenAI API key (https://platform.openai.com/api-keys)"
echo "  2. ElevenLabs API key (https://elevenlabs.io/app/settings)"
echo ""

read -p "Do you have both API keys ready? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please obtain API keys first, then run this script again."
    exit 1
fi

# Backend setup
echo ""
echo "🔧 Setting up Backend..."
echo "------------------------"
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend directory not found. Are you in the right directory?"
    exit 1
fi

echo "Installing dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env with your API keys!"
    echo ""
    read -p "OpenAI API Key: " OPENAI_KEY
    read -p "ElevenLabs API Key: " ELEVENLABS_KEY
    
    sed -i "s/your_openai_api_key_here/$OPENAI_KEY/" .env
    sed -i "s/your_elevenlabs_api_key_here/$ELEVENLABS_KEY/" .env
    
    echo "✅ API keys configured"
fi

echo "✅ Backend setup complete"

# Frontend setup
echo ""
echo "🎨 Setting up Frontend..."
echo "-------------------------"
cd ../frontend

if [ ! -f "package.json" ]; then
    echo "❌ Frontend directory not found."
    exit 1
fi

echo "Installing dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
fi

echo "✅ Frontend setup complete"
echo ""

# Final instructions
echo "✨ Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open browser: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: docs/SETUP.md"
echo "   - API Docs: docs/API.md"
echo "   - Deployment: docs/DEPLOYMENT.md"
echo ""
echo "Humor setting at 75%. Ready to talk!"
