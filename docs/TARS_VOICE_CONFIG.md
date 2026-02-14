# TARS Voice Configuration

## ElevenLabs Voice Setup

### Target Voice Characteristics
- **Character**: TARS from Interstellar (2014)
- **Qualities**: Deep, robotic but warm, precise articulation, slight mechanical undertone
- **Humor Setting**: 75% (per movie reference)

### Recommended ElevenLabs Voices

**Primary Option: Adam**
- Voice ID: `pNInz6obpgDQGcFmaJgB`
- Style: Deep, authoritative, clear
- Settings for TARS-like quality:
  - Stability: 0.75
  - Similarity Boost: 0.80
  - Style: 0.45
  - Use Speaker Boost: true

**Alternative: Antoni**
- Voice ID: `ErXwobaYiN019PkySvjV`
- Style: Well-rounded, articulate
- Settings:
  - Stability: 0.70
  - Similarity Boost: 0.75
  - Style: 0.50

### Voice Cloning (Optional Enhancement)
If you have ElevenLabs Professional/Scale plan:
1. Upload TARS dialogue clips from Interstellar
2. Create instant voice clone
3. Fine-tune with settings above

### API Configuration
```javascript
const ELEVENLABS_CONFIG = {
  voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice
  modelId: 'eleven_turbo_v2_5', // Fastest model for real-time
  voiceSettings: {
    stability: 0.75,
    similarity_boost: 0.80,
    style: 0.45,
    use_speaker_boost: true
  },
  outputFormat: 'pcm_16000' // For WebSocket streaming
};
```

### Testing Voice Quality
Run the test script to hear different configurations:
```bash
npm run test:voice
```
