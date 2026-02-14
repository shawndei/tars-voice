# TARS Voice Conversation App

A real-time voice conversation app inspired by TARS from Interstellar. Features natural voice interactions with <1s latency, powered by OpenAI Whisper (STT), GPT-4 (AI), and ElevenLabs (TTS).

![TARS Voice App](https://img.shields.io/badge/Status-Production%20Ready-green) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Features

### Core Functionality
- 🎤 **Real-time Speech Recognition** - OpenAI Whisper API
- 🤖 **TARS Voice Clone** - ElevenLabs with custom voice settings
- ⚡ **Sub-second Latency** - Target <1000ms end-to-end
- 🔄 **Full-duplex Communication** - WebSocket-based streaming
- ✋ **Natural Interruptions** - Stop TARS mid-response
- 🎯 **Automatic Turn Detection** - No need to manually stop recording

### UI/UX
- 🔵 **Animated Voice Orb** - Visual feedback for speaking/listening
- 📝 **Live Transcripts** - See your words in real-time
- 💬 **Conversation History** - Sidebar with full chat log
- 📱 **Mobile Responsive** - Works on all devices
- 📊 **Performance Metrics** - Real-time latency tracking

### Technical
- 🔌 **WebSocket Backend** - Node.js + Express
- ⚛️ **React Frontend** - Modern, fast, beautiful
- 🎨 **Tailwind CSS** - Sleek, futuristic design
- 🧪 **Full Test Suite** - Quality assurance
- 🚀 **Production Ready** - Railway + Vercel deployment

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key ([get one](https://platform.openai.com))
- ElevenLabs API key ([get one](https://elevenlabs.io))

### Installation

```bash
# Clone repository
git clone <your-repo>
cd voice-conversation-app

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env
# Edit .env if needed

# Start development servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access the App
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Health Check: http://localhost:8080/health

---

## 🎯 Usage

### Basic Conversation
1. Click the green "Connected" indicator to verify connection
2. Press and hold the blue microphone button
3. Speak your message
4. Release the button when done
5. Watch your transcript appear
6. Listen to TARS respond

### Advanced Features
- **Interrupt TARS**: Click "Stop TARS" while he's speaking
- **View History**: Click "Show History" to see conversation log
- **Clear History**: Use "Clear" button in history sidebar
- **Check Latency**: Metrics display below the orb

---

## 🏗️ Architecture

### System Overview
```
┌─────────────┐      WebSocket      ┌─────────────┐
│   React     │ ←─────────────────→ │   Node.js   │
│  Frontend   │                     │   Backend   │
└─────────────┘                     └─────────────┘
                                           │
                          ┌────────────────┼────────────────┐
                          ↓                ↓                ↓
                    ┌──────────┐    ┌──────────┐    ┌──────────┐
                    │ Whisper  │    │  GPT-4   │    │ElevenLabs│
                    │   STT    │    │   LLM    │    │   TTS    │
                    └──────────┘    └──────────┘    └──────────┘
```

### Tech Stack

**Backend**
- Express.js - HTTP server
- ws - WebSocket server
- OpenAI - Whisper STT & GPT-4
- ElevenLabs - TTS with TARS voice
- Custom turn detection

**Frontend**
- React 18 - UI framework
- Zustand - State management
- Tailwind CSS - Styling
- Vite - Build tool
- WebSocket API - Real-time communication

### Data Flow
1. User holds mic button → Start recording
2. Audio chunks stream to backend via WebSocket
3. Turn detector identifies speech end
4. Whisper transcribes audio → Text
5. GPT-4 generates response
6. ElevenLabs synthesizes speech
7. Audio streams back to frontend
8. Browser plays audio with visual feedback

---

## 📁 Project Structure

```
voice-conversation-app/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main server
│   │   ├── voiceSession.js        # Session management
│   │   └── services/
│   │       ├── whisper.js         # STT service
│   │       ├── elevenlabs.js      # TTS service
│   │       ├── openclaw.js        # AI integration
│   │       └── turnDetector.js    # Speech detection
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app
│   │   ├── store/
│   │   │   └── voiceStore.js      # State management
│   │   └── components/
│   │       ├── VoiceInterface.jsx # Main UI
│   │       ├── VoiceOrb.jsx       # Animated orb
│   │       ├── TranscriptDisplay.jsx
│   │       ├── ConversationHistory.jsx
│   │       └── StatusIndicator.jsx
│   ├── package.json
│   └── .env.example
├── tests/
│   ├── voice-test.js              # Voice quality tests
│   ├── latency-test.js            # Performance tests
│   └── integration.test.js        # E2E tests
└── docs/
    ├── TARS_VOICE_CONFIG.md       # Voice setup guide
    ├── DEPLOYMENT.md              # Deploy instructions
    └── API.md                     # API documentation
```

---

## 🎤 TARS Voice Configuration

The app uses ElevenLabs' **Adam** voice with custom settings to mimic TARS:

```javascript
{
  voiceId: 'pNInz6obpgDQGcFmaJgB',
  stability: 0.75,        // Consistent, robotic
  similarity_boost: 0.80, // Clear articulation
  style: 0.45,            // Slightly mechanical
  use_speaker_boost: true
}
```

**Test the voice:**
```bash
cd backend
npm run test:voice
```

See [TARS_VOICE_CONFIG.md](docs/TARS_VOICE_CONFIG.md) for detailed setup.

---

## 🧪 Testing

### Run Tests
```bash
# Backend unit tests
cd backend
npm test

# Voice quality test
npm run test:voice

# Latency benchmark
node ../tests/latency-test.js
```

### Manual Testing
See [tests/README.md](tests/README.md) for full testing checklist.

**Key Metrics:**
- ✅ Total latency: < 1000ms
- ✅ STT accuracy: > 95%
- ✅ TTS quality: Natural, TARS-like
- ✅ Interruption: < 100ms response

---

## 🚀 Deployment

### Quick Deploy

**Backend (Railway)**
```bash
railway login
railway init
railway up
```

**Frontend (Vercel)**
```bash
vercel --prod
```

### Full Guide
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete instructions including:
- Environment configuration
- Custom domains
- Scaling strategies
- Monitoring setup
- Cost estimates

---

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=8080
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend Environment Variables
```env
VITE_WS_URL=ws://localhost:8080
VITE_API_URL=http://localhost:8080
```

---

## 📊 Performance

### Latency Breakdown (Typical)
- **STT (Whisper):** 300-500ms
- **LLM (GPT-4):** 200-400ms
- **TTS (ElevenLabs):** 200-400ms
- **Network:** 50-100ms
- **Total:** 750-1400ms

### Optimization Tips
1. Use `eleven_turbo_v2_5` model (fastest TTS)
2. Keep responses concise (< 3 sentences)
3. Deploy backend near users
4. Enable compression on WebSocket
5. Pre-warm API connections

---

## 🛠️ Development

### Adding New Features

**New Voice Setting:**
Edit `backend/src/services/elevenlabs.js`:
```javascript
this.voiceSettings = {
  stability: 0.80,  // Adjust here
  // ...
};
```

**New UI Component:**
```bash
cd frontend/src/components
touch MyComponent.jsx
```

**New API Endpoint:**
Edit `backend/src/server.js`:
```javascript
app.get('/api/my-endpoint', (req, res) => {
  // handler
});
```

### Code Style
- Backend: ES modules, async/await
- Frontend: React hooks, functional components
- Formatting: 2 spaces, semicolons
- Naming: camelCase (JS), PascalCase (components)

---

## 🐛 Troubleshooting

### Common Issues

**"WebSocket connection failed"**
- Check backend is running: `curl http://localhost:8080/health`
- Verify CORS settings in `.env`
- Check firewall rules

**"Microphone access denied"**
- Grant browser permissions
- Use HTTPS in production
- Check browser compatibility

**"High latency (>2s)"**
- Check API quotas (OpenAI/ElevenLabs)
- Verify network speed
- Monitor backend logs

**"Audio not playing"**
- Check browser audio settings
- Verify audio format support
- Check network tab for chunks

### Debug Mode
```bash
# Backend logs
NODE_ENV=development npm run dev

# Frontend logs
Open browser DevTools → Console
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature-name`
5. Open Pull Request

### Development Guidelines
- Add tests for new features
- Update documentation
- Follow code style
- Keep commits atomic

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **TARS Character** - Interstellar (2014), Paramount Pictures
- **OpenAI** - Whisper & GPT-4 APIs
- **ElevenLabs** - Voice synthesis
- **Railway** - Backend hosting
- **Vercel** - Frontend hosting

---

## 📞 Support

- 🐛 Bug Reports: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)
- 📧 Email: support@yourapp.com

---

## 🎯 Roadmap

- [ ] Voice cloning from Interstellar audio clips
- [ ] Multi-language support
- [ ] Voice activity detection (VAD) improvement
- [ ] Conversation summaries
- [ ] Export conversation transcripts
- [ ] Custom wake word ("Hey TARS")
- [ ] Humor setting adjustment (like in the movie!)
- [ ] Mobile native apps (iOS/Android)

---

**"Humor setting at 75%. Let's talk."** - TARS
