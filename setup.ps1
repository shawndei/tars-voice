# TARS Voice App - Quick Setup Script (Windows PowerShell)

Write-Host "🤖 TARS Voice Conversation App - Setup Script" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Download: https://nodejs.org/"
    exit 1
}

Write-Host ""

# API Keys Check
Write-Host "📋 API Keys Check" -ForegroundColor Yellow
Write-Host "-----------------"
Write-Host "You will need:"
Write-Host "  1. OpenAI API key (https://platform.openai.com/api-keys)"
Write-Host "  2. ElevenLabs API key (https://elevenlabs.io/app/settings)"
Write-Host ""

$ready = Read-Host "Do you have both API keys ready? (y/n)"
if ($ready -ne "y" -and $ready -ne "Y") {
    Write-Host "Please obtain API keys first, then run this script again."
    exit 1
}

# Backend setup
Write-Host ""
Write-Host "🔧 Setting up Backend..." -ForegroundColor Yellow
Write-Host "------------------------"

if (!(Test-Path "backend\package.json")) {
    Write-Host "❌ Backend directory not found. Are you in the right directory?" -ForegroundColor Red
    exit 1
}

Set-Location backend

Write-Host "Installing dependencies..."
npm install

if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..."
    Copy-Item .env.example .env
    
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Configuring API keys..." -ForegroundColor Yellow
    Write-Host ""
    
    $openaiKey = Read-Host "OpenAI API Key"
    $elevenlabsKey = Read-Host "ElevenLabs API Key"
    
    $envContent = Get-Content .env
    $envContent = $envContent -replace 'your_openai_api_key_here', $openaiKey
    $envContent = $envContent -replace 'your_elevenlabs_api_key_here', $elevenlabsKey
    $envContent | Set-Content .env
    
    Write-Host "✅ API keys configured" -ForegroundColor Green
}

Write-Host "✅ Backend setup complete" -ForegroundColor Green

# Frontend setup
Write-Host ""
Write-Host "🎨 Setting up Frontend..." -ForegroundColor Yellow
Write-Host "-------------------------"

Set-Location ..\frontend

if (!(Test-Path "package.json")) {
    Write-Host "❌ Frontend directory not found." -ForegroundColor Red
    exit 1
}

Write-Host "Installing dependencies..."
npm install

if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..."
    Copy-Item .env.example .env
}

Write-Host "✅ Frontend setup complete" -ForegroundColor Green
Write-Host ""

# Final instructions
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "=================="
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Backend (PowerShell 1):" -ForegroundColor Yellow
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "2. Frontend (PowerShell 2):" -ForegroundColor Yellow
Write-Host "   cd frontend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "3. Open browser: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Setup Guide: docs\SETUP.md"
Write-Host "   - API Docs: docs\API.md"
Write-Host "   - Deployment: docs\DEPLOYMENT.md"
Write-Host ""
Write-Host "Humor setting at 75%. Ready to talk!" -ForegroundColor Green

Set-Location ..
