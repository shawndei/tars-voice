import { v4 as uuidv4 } from 'uuid';
import { WhisperSTT } from './services/whisper.js';
import { ElevenLabsTTS } from './services/elevenlabs.js';
import { OpenClawIntegration } from './services/openclaw.js';
import { TurnDetector } from './services/turnDetector.js';
import { logger } from './utils/logger.js';

export class VoiceSessionManager {
  constructor(ws, sessionId = null) {
    this.ws = ws;
    this.sessionId = sessionId || uuidv4();
    this.stt = new WhisperSTT();
    this.tts = new ElevenLabsTTS();
    this.openclaw = new OpenClawIntegration();
    this.turnDetector = new TurnDetector();
    
    // Audio buffers
    this.audioBuffer = [];
    this.isRecording = false;
    this.isSpeaking = false;
    this.currentTTSStream = null;
    
    // Conversation state
    this.conversationHistory = [];
    this.lastActivityTime = Date.now();
    
    // Metrics
    this.metrics = {
      sttLatency: [],
      ttsLatency: [],
      totalLatency: []
    };
  }

  async handleMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case 'start_recording':
        await this.startRecording();
        break;
      
      case 'audio_chunk':
        await this.handleAudioChunk(payload);
        break;
      
      case 'stop_recording':
        await this.stopRecording();
        break;
      
      case 'interrupt':
        await this.handleInterrupt();
        break;
      
      case 'get_history':
        this.sendHistory();
        break;
      
      case 'clear_history':
        this.clearHistory();
        break;
      
      default:
        logger.warn(`Unknown message type: ${type}`);
    }

    this.lastActivityTime = Date.now();
  }

  async startRecording() {
    this.isRecording = true;
    this.audioBuffer = [];
    this.turnDetector.reset();
    
    this.send({
      type: 'recording_started',
      timestamp: Date.now()
    });
    
    logger.info(`Recording started for session ${this.sessionId}`);
  }

  async handleAudioChunk(audioData) {
    if (!this.isRecording) return;

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');
    this.audioBuffer.push(audioBuffer);

    // Turn detection - check for speech end
    const turnComplete = await this.turnDetector.processAudio(audioBuffer);
    
    if (turnComplete) {
      logger.info('Turn detected, processing speech');
      await this.stopRecording();
    }
  }

  async stopRecording() {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    const startTime = Date.now();

    try {
      // Combine audio buffers
      const fullAudio = Buffer.concat(this.audioBuffer);
      
      this.send({
        type: 'processing_audio',
        timestamp: Date.now()
      });

      // STT - Speech to Text
      const sttStart = Date.now();
      const transcript = await this.stt.transcribe(fullAudio);
      const sttLatency = Date.now() - sttStart;
      
      this.metrics.sttLatency.push(sttLatency);
      
      logger.info(`STT completed in ${sttLatency}ms: "${transcript}"`);
      
      this.send({
        type: 'transcript',
        transcript,
        timestamp: Date.now()
      });

      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: transcript,
        timestamp: Date.now()
      });

      // Get AI response via OpenClaw
      const aiResponse = await this.openclaw.chat(transcript, this.conversationHistory);
      
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      });

      // TTS - Text to Speech
      const ttsStart = Date.now();
      await this.streamTTS(aiResponse);
      const ttsLatency = Date.now() - ttsStart;
      
      this.metrics.ttsLatency.push(ttsLatency);
      
      const totalLatency = Date.now() - startTime;
      this.metrics.totalLatency.push(totalLatency);
      
      logger.info(`Total latency: ${totalLatency}ms (STT: ${sttLatency}ms, TTS: ${ttsLatency}ms)`);
      
      this.send({
        type: 'metrics',
        metrics: {
          sttLatency,
          ttsLatency,
          totalLatency
        }
      });

    } catch (error) {
      logger.error('Error processing audio:', error);
      this.send({
        type: 'error',
        error: error.message
      });
    } finally {
      this.audioBuffer = [];
    }
  }

  async streamTTS(text) {
    this.isSpeaking = true;
    
    this.send({
      type: 'assistant_response',
      text,
      timestamp: Date.now()
    });

    try {
      // Stream audio from ElevenLabs
      const audioStream = await this.tts.synthesizeStream(text);
      this.currentTTSStream = audioStream;

      for await (const audioChunk of audioStream) {
        if (!this.isSpeaking) break; // Interrupted
        
        this.send({
          type: 'audio_chunk',
          audio: audioChunk.toString('base64'),
          timestamp: Date.now()
        });
      }

      this.send({
        type: 'audio_complete',
        timestamp: Date.now()
      });

    } catch (error) {
      logger.error('TTS streaming error:', error);
      throw error;
    } finally {
      this.isSpeaking = false;
      this.currentTTSStream = null;
    }
  }

  async handleInterrupt() {
    logger.info('Interrupt received');
    
    this.isSpeaking = false;
    
    if (this.currentTTSStream) {
      this.currentTTSStream.destroy?.();
      this.currentTTSStream = null;
    }

    this.send({
      type: 'interrupted',
      timestamp: Date.now()
    });
  }

  sendHistory() {
    this.send({
      type: 'conversation_history',
      history: this.conversationHistory
    });
  }

  clearHistory() {
    this.conversationHistory = [];
    this.send({
      type: 'history_cleared'
    });
  }

  send(data) {
    if (this.ws.readyState === 1) { // OPEN
      this.ws.send(JSON.stringify(data));
    }
  }

  cleanup() {
    this.handleInterrupt();
    this.audioBuffer = [];
    logger.info(`Session ${this.sessionId} cleaned up`);
  }

  getMetrics() {
    const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    
    return {
      avgSttLatency: avg(this.metrics.sttLatency),
      avgTtsLatency: avg(this.metrics.ttsLatency),
      avgTotalLatency: avg(this.metrics.totalLatency),
      conversationTurns: this.conversationHistory.length / 2
    };
  }
}
