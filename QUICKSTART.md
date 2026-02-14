# Quick Start Guide

Get TARS running in 5 minutes!

---

## Prerequisites

- ✅ Node.js 18+ installed ([download](https://nodejs.org/))
- ✅ OpenAI API key ([get one](https://platform.openai.com/api-keys))
- ✅ ElevenLabs API key ([get one](https://elevenlabs.io/sign-up))

---

## Automated Setup (Recommended)

### Windows (PowerShell)
```powershell
.\setup.ps1
```

### Mac/Linux (Bash)
```bash
chmod +x setup.sh
./setup.sh
```

The script will:
1. Check dependencies
2. Install packages
3. Configure environment
4. Guide you through API key setup

---

## Manual Setup (Alternative)

### 1. Backend Setup

```bash
# Install dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start server
npm run dev
```

### 2. Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Configure environment (optional - defaults are fine for local dev)
cp .env.example .env

# Start development server
npm run dev
```

### 3. Open Browser

Visit: http://localhost:3000

---

## Test It Out

1. Click "Allow" when asked for microphone access
2. Press and hold the blue button
3. Say: "Hello TARS"
4. Release button
5. Listen to TARS respond!

---

## What's Next?

### Learn More
- 📖 [Full Documentation](README.md)
- 🔧 [Detailed Setup Guide](docs/SETUP.md)
- 📡 [API Documentation](docs/API.md)

### Customize
- 🎤 [Adjust TARS Voice](docs/TARS_VOICE_CONFIG.md)
- 🎨 Edit UI in `frontend/src/`
- 🔌 Modify backend in `backend/src/`

### Deploy
- 🚀 [Deploy to Production](docs/DEPLOYMENT.md)
  - Backend: Railway
  - Frontend: Vercel

---

## Troubleshooting

### "Backend won't start"
- Check `.env` file has valid API keys
- Verify port 8080 is free
- See logs for specific errors

### "Frontend shows disconnected"
- Ensure backend is running
- Check backend terminal for errors
- Try refreshing browser

### "No audio"
- Grant microphone permission
- Check speaker volume
- Verify ElevenLabs API key is valid

**More help:** [docs/SETUP.md#troubleshooting](docs/SETUP.md#troubleshooting)

---

## Architecture Overview

```
┌─────────────────┐
│  React Frontend │ ← You see this
│   (localhost:   │   Beautiful UI with orb
│     3000)       │   Mic button, transcripts
└────────┬────────┘
         │ WebSocket
         ↓
┌─────────────────┐
│  Node.js Backend│ ← Does the heavy lifting
│   (localhost:   │   STT → AI → TTS pipeline
│     8080)       │   Manages sessions
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓         ↓
┌────────┐ ┌────────┐ ┌────────┐
│Whisper │ │ GPT-4  │ │ElevenLa│
│  STT   │ │  AI    │ │bs TTS  │ ← External APIs
└────────┘ └────────┘ └────────┘
```

---

## Key Features

✨ **Real-time Voice Conversation**
- Sub-second latency (<1s target)
- Natural interruptions
- Automatic turn detection

🎙️ **TARS Voice Clone**
- Uses ElevenLabs "Adam" voice
- Custom settings for TARS personality
- Adjustable humor setting (75% by default)

🎨 **Beautiful UI**
- Animated blue orb
- Live transcripts
- Conversation history
- Mobile responsive

---

## Cost Estimate (Monthly)

**Light Usage** (50 conversations/month)
- OpenAI: ~$12
- ElevenLabs: Free tier
- Hosting: $5
- **Total: ~$17/month**

**Medium Usage** (300 conversations/month)
- OpenAI: ~$70
- ElevenLabs: $5
- Hosting: $25
- **Total: ~$100/month**

---

## Tips for Best Experience

1. **Use headphones** - Prevents audio feedback
2. **Speak clearly** - Better transcription accuracy
3. **Keep it concise** - TARS responds faster to short questions
4. **Try interrupting** - Click "Stop TARS" while he's speaking
5. **Check metrics** - Monitor latency below the orb

---

## Example Conversations

**Good questions:**
- "What's the status of the mission?"
- "Tell me about relativity."
- "What's your humor setting?"
- "Increase your humor to 100 percent."

**Fun ones:**
- "Tell me a joke."
- "What do you think of humans?"
- "Are you planning a robot colony?"
- "Show me your cue light."

---

## Support

Need help?
- 📖 [Full Documentation](README.md)
- 🐛 [Report Bug](https://github.com/your-repo/issues)
- 💬 [Ask Question](https://github.com/your-repo/discussions)

---

**"Plenty of slaves for my robot colony. Just kidding."** - TARS

---

Ready to start? Run the setup script above! 🚀
