import axios from 'axios';
import { logger } from '../utils/logger.js';
import { Readable } from 'stream';

export class ElevenLabsTTS {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB'; // Adam voice
    this.baseUrl = 'https://api.elevenlabs.io/v1';
    
    // TARS-optimized voice settings
    this.voiceSettings = {
      stability: 0.75,
      similarity_boost: 0.80,
      style: 0.45,
      use_speaker_boost: true
    };
  }

  async synthesizeStream(text) {
    try {
      const startTime = Date.now();

      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/text-to-speech/${this.voiceId}/stream`,
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        data: {
          text,
          model_id: 'eleven_turbo_v2_5', // Fastest model
          voice_settings: this.voiceSettings
        },
        responseType: 'stream'
      });

      logger.info(`ElevenLabs TTS streaming started for text: "${text.substring(0, 50)}..."`);

      // Convert axios stream to async iterator
      return this.createAsyncIterator(response.data);

    } catch (error) {
      logger.error('ElevenLabs TTS error:', error.response?.data || error.message);
      throw new Error(`TTS failed: ${error.message}`);
    }
  }

  async *createAsyncIterator(stream) {
    const chunks = [];
    
    for await (const chunk of stream) {
      yield chunk;
    }
  }

  async synthesize(text) {
    try {
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        data: {
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: this.voiceSettings
        },
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);

    } catch (error) {
      logger.error('ElevenLabs TTS error:', error.response?.data || error.message);
      throw new Error(`TTS failed: ${error.message}`);
    }
  }

  // Test voice configuration
  async testVoice(testText = "Hello, I am TARS. Humor setting at 75 percent.") {
    try {
      const audio = await this.synthesize(testText);
      logger.info(`Voice test successful. Audio size: ${audio.length} bytes`);
      return audio;
    } catch (error) {
      logger.error('Voice test failed:', error);
      throw error;
    }
  }
}
