import { logger } from '../utils/logger.js';

export class TurnDetector {
  constructor() {
    this.silenceThreshold = 500; // ms of silence before considering turn complete
    this.minSpeechDuration = 300; // minimum speech duration
    this.lastAudioTime = null;
    this.speechStartTime = null;
    this.silenceTimer = null;
  }

  reset() {
    this.lastAudioTime = null;
    this.speechStartTime = null;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  async processAudio(audioBuffer) {
    const now = Date.now();
    
    // Detect if audio contains speech (simplified - in production use VAD)
    const hasSpeech = this.detectSpeech(audioBuffer);

    if (hasSpeech) {
      this.lastAudioTime = now;
      
      if (!this.speechStartTime) {
        this.speechStartTime = now;
        logger.debug('Speech started');
      }

      // Clear any existing silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }

      return false; // Turn not complete yet
    } else {
      // Silence detected
      if (this.speechStartTime && !this.silenceTimer) {
        // Start silence timer
        return new Promise((resolve) => {
          this.silenceTimer = setTimeout(() => {
            const speechDuration = now - this.speechStartTime;
            
            if (speechDuration >= this.minSpeechDuration) {
              logger.info(`Turn complete. Speech duration: ${speechDuration}ms`);
              this.reset();
              resolve(true); // Turn complete
            } else {
              resolve(false); // Too short, keep recording
            }
          }, this.silenceThreshold);
        });
      }

      return false;
    }
  }

  detectSpeech(audioBuffer) {
    // Simplified speech detection based on audio level
    // In production, use proper VAD (Voice Activity Detection)
    
    // Convert buffer to samples and check RMS
    const samples = new Int16Array(audioBuffer.buffer, audioBuffer.byteOffset, audioBuffer.length / 2);
    let sum = 0;
    
    for (let i = 0; i < samples.length; i++) {
      sum += samples[i] * samples[i];
    }
    
    const rms = Math.sqrt(sum / samples.length);
    const threshold = 500; // Adjust based on testing
    
    return rms > threshold;
  }

  // Alternative: Use WebRTC VAD or similar library
  async detectSpeechWithVAD(audioBuffer) {
    // Placeholder for more sophisticated VAD
    // Could integrate: @ricky0123/vad-node or similar
    return this.detectSpeech(audioBuffer);
  }
}
