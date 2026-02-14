# Testing Suite

## Available Tests

### 1. Voice Quality Test
Tests ElevenLabs voice configuration for TARS-like quality.

```bash
cd backend
npm run test:voice
```

**What it tests:**
- Voice settings (stability, similarity, style)
- Audio generation speed
- Multiple TARS phrases
- Output quality

**Output:** Audio files in `tests/output/` directory

---

### 2. Latency Test
Measures end-to-end latency for STT → LLM → TTS pipeline.

```bash
cd backend
node ../tests/latency-test.js
```

**Target:** < 1000ms total latency

**Breakdown:**
- STT (Whisper): ~300-500ms
- LLM (GPT-4): ~200-400ms
- TTS (ElevenLabs): ~200-400ms

---

### 3. Integration Tests
Full WebSocket integration testing.

```bash
cd backend
npm test
```

**What it tests:**
- WebSocket connection
- Message handling
- Recording flow
- Interruption
- History management

---

## Manual Testing Checklist

### Basic Functionality
- [ ] Connect to backend (green status indicator)
- [ ] Press and hold mic button to record
- [ ] See "Recording..." state
- [ ] Release button to send
- [ ] See transcript appear
- [ ] Hear TARS response
- [ ] See blue orb animate

### Advanced Features
- [ ] Interrupt TARS mid-response
- [ ] View conversation history
- [ ] Clear conversation history
- [ ] Multiple consecutive turns
- [ ] Check latency metrics

### Mobile Testing
- [ ] Touch and hold to record (iOS/Android)
- [ ] Responsive layout
- [ ] Audio playback works
- [ ] History sidebar slides out

### Edge Cases
- [ ] No microphone permission
- [ ] Network disconnection
- [ ] Very long audio
- [ ] Very short audio (< 300ms)
- [ ] Rapid consecutive recordings
- [ ] Background audio during recording

---

## Performance Benchmarks

### Latency Targets
- **Excellent:** < 1000ms
- **Good:** 1000-1500ms
- **Acceptable:** 1500-2000ms
- **Needs work:** > 2000ms

### STT Accuracy
- **Target:** > 95% word accuracy
- **Minimum:** > 90% word accuracy

### TTS Quality
- **Voice similarity to TARS:** Subjective (should sound robotic yet warm)
- **Pronunciation:** Clear and precise
- **Emotional tone:** Logical with occasional dry humor

---

## Continuous Testing

Run tests before every deployment:

```bash
# Backend tests
cd backend
npm test
npm run test:voice

# Frontend build test
cd ../frontend
npm run build

# Full system test
# 1. Start backend: npm run dev
# 2. Start frontend: npm run dev
# 3. Test in browser
```
