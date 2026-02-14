# Setup Guide

Complete step-by-step setup instructions for the TARS Voice Conversation App.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [API Keys Setup](#api-keys-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 18.0.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **npm** 8.0.0 or higher
  - Included with Node.js
  - Verify: `npm --version`

- **Git** (for deployment)
  - Download: https://git-scm.com/
  - Verify: `git --version`

### Accounts Needed

- **OpenAI Account** - For Whisper STT and GPT-4
  - Sign up: https://platform.openai.com/signup
  - Billing required: Add payment method

- **ElevenLabs Account** - For TARS voice TTS
  - Sign up: https://elevenlabs.io/sign-up
  - Free tier available: 10,000 characters/month

---

## API Keys Setup

### 1. OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it "TARS Voice App"
4. Copy the key (starts with `sk-...`)
5. **Important:** Save it securely - you won't see it again!

**Cost Estimate:**
- Whisper: $0.006 per minute
- GPT-4: $0.03 per 1K tokens
- Example: 100 conversations (~5min each) = ~$25/month

### 2. ElevenLabs API Key

1. Go to https://elevenlabs.io/app/settings
2. Navigate to "API Keys" section
3. Click "Generate new API key"
4. Copy the key
5. Save securely

**Cost Estimate:**
- Free: 10,000 characters/month
- Starter: $5/month for 30,000 characters
- Example: 100 conversations (~100 chars each) = ~10,000 characters

### 3. Voice ID (Optional)

Default voice: Adam (`pNInz6obpgDQGcFmaJgB`)

To use a different voice:
1. Go to https://elevenlabs.io/app/voice-library
2. Browse voices
3. Click on a voice → Copy "Voice ID"
4. Update in `.env` file

---

## Backend Setup

### Step 1: Navigate to Backend

```bash
cd voice-conversation-app/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

**What this installs:**
- Express - Web server
- ws - WebSocket server
- openai - OpenAI API client
- axios - HTTP client for ElevenLabs
- dotenv - Environment variable management
- And more...

**Expected output:**
```
added 156 packages, and audited 157 packages in 12s
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your API keys
# Windows: notepad .env
# Mac/Linux: nano .env
```

**Required variables:**
```env
PORT=8080
OPENAI_API_KEY=sk-your-actual-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

**Important:** 
- Replace `your-actual-key-here` with real API keys
- Never commit `.env` to version control

### Step 4: Verify Setup

```bash
npm run dev
```

**Expected output:**
```
[INFO] 2024-02-13T20:00:00.000Z - TARS Voice Server running on port 8080
```

**Test health endpoint:**
```bash
curl http://localhost:8080/health
```

Should return:
```json
{
  "status": "healthy",
  "uptime": 0.123,
  "timestamp": "2024-02-13T20:00:00.000Z"
}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

**What this installs:**
- React - UI framework
- Vite - Build tool
- Tailwind CSS - Styling
- Zustand - State management
- And more...

**Expected output:**
```
added 89 packages, and audited 90 packages in 8s
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env
```

**.env contents:**
```env
VITE_WS_URL=ws://localhost:8080
VITE_API_URL=http://localhost:8080
```

**Note:** These are defaults for local development. No changes needed unless using custom ports.

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.1.0  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Open in Browser

1. Open: http://localhost:3000
2. You should see the TARS Voice App
3. Status indicator should show "Connected" (green)

---

## Verification

### Backend Checks

✅ **Server Running**
```bash
curl http://localhost:8080/health
# Should return: { "status": "healthy", ... }
```

✅ **WebSocket Available**
- Open browser DevTools
- Console: `new WebSocket('ws://localhost:8080')`
- Should connect successfully

✅ **Logs Clean**
- Check terminal running backend
- Should see no errors

### Frontend Checks

✅ **App Loads**
- Visit http://localhost:3000
- See "TARS" header
- See blue orb
- See "Connected" status

✅ **No Console Errors**
- Open browser DevTools (F12)
- Console tab should be clean
- No red error messages

### End-to-End Test

✅ **Record Audio**
1. Click "Allow" when browser asks for microphone
2. Press and hold blue mic button
3. Say: "Hello TARS"
4. Release button
5. Should see transcript appear
6. Should hear TARS respond

**If successful:** You're all set! 🎉

---

## Troubleshooting

### Backend Issues

#### "Cannot find module"
**Problem:** Dependency missing

**Solution:**
```bash
cd backend
rm -rf node_modules
npm install
```

#### "OPENAI_API_KEY is not set"
**Problem:** Environment variable not loaded

**Solution:**
- Check `.env` file exists in backend directory
- Verify file has correct variable names
- Restart server: `npm run dev`

#### "Port 8080 already in use"
**Problem:** Another process using port

**Solution:**
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8080 | xargs kill -9

# Or change port in .env:
PORT=8081
```

#### "API request failed"
**Problem:** Invalid API key or quota exceeded

**Solution:**
- Verify API keys are correct
- Check OpenAI billing: https://platform.openai.com/account/billing
- Check ElevenLabs usage: https://elevenlabs.io/app/usage

### Frontend Issues

#### "Failed to fetch"
**Problem:** Backend not running or CORS issue

**Solution:**
- Ensure backend is running: `cd backend && npm run dev`
- Check CORS_ORIGIN in backend `.env` matches frontend URL
- Try hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)

#### "WebSocket connection failed"
**Problem:** Backend WebSocket not accessible

**Solution:**
- Check backend logs for errors
- Verify WS_URL in frontend `.env` is correct
- Ensure firewall not blocking port 8080

#### "Microphone access denied"
**Problem:** Browser permission not granted

**Solution:**
1. Click lock icon in address bar
2. Set Microphone to "Allow"
3. Refresh page
4. Or use Settings → Privacy → Microphone

### Audio Issues

#### "No audio playing"
**Problem:** Browser audio blocked or codec issue

**Solution:**
- Check browser audio not muted
- Try different browser (Chrome recommended)
- Check DevTools Network tab for audio chunks
- Verify ElevenLabs API key is valid

#### "Choppy audio"
**Problem:** Network latency or buffering

**Solution:**
- Check internet speed
- Close other bandwidth-heavy apps
- Try wired connection instead of WiFi

---

## Next Steps

### Development
- Read [API.md](API.md) for WebSocket protocol
- Read [TARS_VOICE_CONFIG.md](TARS_VOICE_CONFIG.md) for voice tuning
- Start building your features!

### Testing
- Run test suite: `cd backend && npm test`
- Test voice quality: `npm run test:voice`
- See [tests/README.md](../tests/README.md)

### Deployment
- Ready to deploy? See [DEPLOYMENT.md](DEPLOYMENT.md)
- Deploy to Railway (backend)
- Deploy to Vercel (frontend)

---

## Getting Help

### Resources
- 📖 [Main README](../README.md)
- 📡 [API Documentation](API.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 🧪 [Testing Guide](../tests/README.md)

### Support Channels
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)
- 💬 [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 Email: support@yourapp.com

### Common Questions

**Q: Do I need a paid OpenAI plan?**
A: Yes, you need to add a payment method. Free tier is not sufficient for Whisper API.

**Q: Can I use a different voice?**
A: Yes! Browse ElevenLabs voice library and update `ELEVENLABS_VOICE_ID` in `.env`

**Q: How much will this cost to run?**
A: See cost estimates in [DEPLOYMENT.md](DEPLOYMENT.md). Roughly $70-100/month for moderate usage.

**Q: Can I deploy for free?**
A: Backend: Railway hobby tier ($5/month). Frontend: Vercel free tier. APIs: ~$20-50/month minimum.

**Q: Is this production-ready?**
A: Yes! With proper testing and monitoring. See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup.

---

**"Setup complete. Humor setting at 75%."** - TARS
