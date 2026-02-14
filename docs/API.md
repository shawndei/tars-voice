# API Documentation

Complete reference for the TARS Voice Conversation App API.

---

## WebSocket API

### Connection

**Endpoint:** `ws://localhost:8080` (development) or `wss://your-app.railway.app` (production)

**URL Parameters:**
- `sessionId` (optional): Resume existing session

**Example:**
```javascript
const ws = new WebSocket('ws://localhost:8080?sessionId=abc-123');
```

### Connection Events

#### Connected
Server sends on successful connection.

```json
{
  "type": "connected",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "TARS voice assistant ready"
}
```

---

## Client → Server Messages

### 1. Start Recording

Begin audio recording session.

```json
{
  "type": "start_recording"
}
```

**Response:**
```json
{
  "type": "recording_started",
  "timestamp": 1707844800000
}
```

---

### 2. Audio Chunk

Stream audio data during recording.

```json
{
  "type": "audio_chunk",
  "payload": "base64_encoded_audio_data"
}
```

**Format:** Base64-encoded WebM audio (Opus codec)

**Frequency:** Send chunks every 100-200ms

---

### 3. Stop Recording

End recording and process audio.

```json
{
  "type": "stop_recording"
}
```

**Response:** Triggers processing pipeline (see Server → Client messages)

---

### 4. Interrupt

Stop TARS mid-response.

```json
{
  "type": "interrupt"
}
```

**Response:**
```json
{
  "type": "interrupted",
  "timestamp": 1707844800000
}
```

---

### 5. Get History

Request conversation history.

```json
{
  "type": "get_history"
}
```

**Response:**
```json
{
  "type": "conversation_history",
  "history": [
    {
      "role": "user",
      "content": "What's the mission status?",
      "timestamp": 1707844800000
    },
    {
      "role": "assistant",
      "content": "All systems nominal. Humor setting at 75%.",
      "timestamp": 1707844801000
    }
  ]
}
```

---

### 6. Clear History

Clear conversation history.

```json
{
  "type": "clear_history"
}
```

**Response:**
```json
{
  "type": "history_cleared"
}
```

---

## Server → Client Messages

### 1. Recording Started

Confirms recording has begun.

```json
{
  "type": "recording_started",
  "timestamp": 1707844800000
}
```

---

### 2. Processing Audio

Audio is being transcribed.

```json
{
  "type": "processing_audio",
  "timestamp": 1707844800000
}
```

---

### 3. Transcript

Speech-to-text result.

```json
{
  "type": "transcript",
  "transcript": "What's the status of the mission?",
  "timestamp": 1707844800500
}
```

---

### 4. Assistant Response

AI-generated response text.

```json
{
  "type": "assistant_response",
  "text": "All systems nominal. Proceeding as planned.",
  "timestamp": 1707844801000
}
```

---

### 5. Audio Chunk

Streaming TTS audio.

```json
{
  "type": "audio_chunk",
  "audio": "base64_encoded_mp3_data",
  "timestamp": 1707844801200
}
```

**Format:** Base64-encoded MP3

**Playback:** Decode and play immediately for low-latency streaming

---

### 6. Audio Complete

TTS finished, all audio sent.

```json
{
  "type": "audio_complete",
  "timestamp": 1707844802000
}
```

---

### 7. Metrics

Performance metrics for the interaction.

```json
{
  "type": "metrics",
  "metrics": {
    "sttLatency": 450,
    "ttsLatency": 380,
    "totalLatency": 950
  }
}
```

**Units:** Milliseconds

---

### 8. Error

Error occurred during processing.

```json
{
  "type": "error",
  "error": "STT failed: API quota exceeded"
}
```

---

### 9. Interrupted

Confirmation of interruption.

```json
{
  "type": "interrupted",
  "timestamp": 1707844801500
}
```

---

## REST API

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "uptime": 12345.67,
  "timestamp": "2024-02-13T20:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Server is healthy
- `500 Internal Server Error` - Server has issues

---

## Message Flow Examples

### Complete Conversation Flow

```
Client → Server: { type: "start_recording" }
Server → Client: { type: "recording_started" }

Client → Server: { type: "audio_chunk", payload: "..." }
Client → Server: { type: "audio_chunk", payload: "..." }
Client → Server: { type: "audio_chunk", payload: "..." }

Client → Server: { type: "stop_recording" }
Server → Client: { type: "processing_audio" }
Server → Client: { type: "transcript", transcript: "Hello TARS" }
Server → Client: { type: "assistant_response", text: "Hello. How can I help?" }
Server → Client: { type: "audio_chunk", audio: "..." }
Server → Client: { type: "audio_chunk", audio: "..." }
Server → Client: { type: "audio_complete" }
Server → Client: { type: "metrics", metrics: {...} }
```

---

### Interruption Flow

```
Server → Client: { type: "audio_chunk", audio: "..." }
Server → Client: { type: "audio_chunk", audio: "..." }

Client → Server: { type: "interrupt" }
Server → Client: { type: "interrupted" }

Client → Server: { type: "start_recording" }
...
```

---

## Error Handling

### Common Error Codes

| Error | Description | Solution |
|-------|-------------|----------|
| `STT failed: ...` | Whisper API error | Check OpenAI API key, quota |
| `TTS failed: ...` | ElevenLabs API error | Check ElevenLabs API key, quota |
| `Chat failed: ...` | GPT-4 API error | Check OpenAI API key, quota |
| `Invalid message type` | Unknown message type | Check client implementation |

### Error Response Format

```json
{
  "type": "error",
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "timestamp": 1707844800000
}
```

---

## Rate Limits

### API Limits (External)

**OpenAI:**
- Whisper: 50 requests/minute (free tier)
- GPT-4: 200 requests/minute

**ElevenLabs:**
- Free: 10,000 characters/month
- Starter: 30,000 characters/month
- Creator: 100,000 characters/month

### WebSocket Limits

- **Max connections:** 1000 per server
- **Max message size:** 10MB
- **Idle timeout:** 5 minutes
- **Max recording duration:** 2 minutes

---

## Authentication

Currently using API keys in backend environment variables.

**Future Enhancement:** Add user authentication:
```json
{
  "type": "auth",
  "token": "jwt_token_here"
}
```

---

## Best Practices

### Client Implementation

1. **Reconnection Logic**
   ```javascript
   ws.onclose = () => {
     setTimeout(() => connect(), 1000); // Retry after 1s
   };
   ```

2. **Audio Chunking**
   - Send chunks every 100-200ms
   - Use MediaRecorder with appropriate timeSlice

3. **Error Handling**
   - Always listen for `error` messages
   - Display user-friendly messages
   - Retry on transient errors

4. **Buffering**
   - Buffer audio chunks before playing
   - Prevents choppy playback

5. **Cleanup**
   - Stop recording on disconnect
   - Clear timers and listeners

---

## Testing

### Test WebSocket Connection

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => console.log('Connected!');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.onerror = (e) => console.error('Error:', e);

ws.send(JSON.stringify({ type: 'get_history' }));
```

### Curl Health Check

```bash
curl http://localhost:8080/health
```

---

## Changelog

### v1.0.0 (2024-02-13)
- Initial release
- WebSocket API with full-duplex audio
- STT, LLM, TTS pipeline
- Interruption support
- Conversation history

---

## Support

For API questions:
- 📖 [Main Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)
