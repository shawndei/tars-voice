import OpenAI from 'openai';
import FormData from 'form-data';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class WhisperSTT {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async transcribe(audioBuffer) {
    try {
      const startTime = Date.now();

      // Save buffer to temp file (Whisper API requires file input)
      const tempFile = path.join(__dirname, '../../temp', `audio-${Date.now()}.webm`);
      const tempDir = path.dirname(tempFile);
      
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      fs.writeFileSync(tempFile, audioBuffer);

      // Transcribe using Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFile),
        model: 'whisper-1',
        language: 'en',
        response_format: 'json'
      });

      // Cleanup temp file
      fs.unlinkSync(tempFile);

      const duration = Date.now() - startTime;
      logger.info(`Whisper transcription completed in ${duration}ms`);

      return transcription.text;

    } catch (error) {
      logger.error('Whisper transcription error:', error);
      throw new Error(`STT failed: ${error.message}`);
    }
  }

  // Alternative: Streaming transcription (if using AssemblyAI or similar)
  async transcribeStream(audioStream) {
    // Placeholder for streaming STT if needed
    throw new Error('Streaming STT not implemented yet');
  }
}
