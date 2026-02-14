import { create } from 'zustand';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const useVoiceStore = create((set, get) => ({
  // Connection state
  ws: null,
  connectionStatus: 'disconnected', // disconnected, connecting, connected
  sessionId: null,

  // Recording state
  isRecording: false,
  isProcessing: false,
  isSpeaking: false,

  // Audio
  mediaRecorder: null,
  audioContext: null,
  audioQueue: [],

  // Transcripts
  currentTranscript: '',
  conversationHistory: [],

  // Metrics
  metrics: {
    sttLatency: 0,
    ttsLatency: 0,
    totalLatency: 0
  },

  // Actions
  connect: () => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) return;

    set({ connectionStatus: 'connecting' });

    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      set({ 
        connectionStatus: 'connected',
        ws: websocket 
      });
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      get().handleMessage(data);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ connectionStatus: 'disconnected' });
    };

    websocket.onclose = () => {
      console.log('WebSocket closed');
      set({ 
        connectionStatus: 'disconnected',
        ws: null 
      });
    };

    set({ ws: websocket });
  },

  disconnect: () => {
    const { ws, stopRecording } = get();
    stopRecording();
    ws?.close();
    set({ 
      ws: null, 
      connectionStatus: 'disconnected' 
    });
  },

  handleMessage: (data) => {
    const { type, ...payload } = data;

    switch (type) {
      case 'connected':
        set({ sessionId: payload.sessionId });
        console.log('Session ID:', payload.sessionId);
        break;

      case 'recording_started':
        set({ isRecording: true });
        break;

      case 'processing_audio':
        set({ isProcessing: true, isRecording: false });
        break;

      case 'transcript':
        set({ 
          currentTranscript: payload.transcript,
          isProcessing: false 
        });
        get().addToHistory('user', payload.transcript);
        break;

      case 'assistant_response':
        set({ currentTranscript: '' });
        get().addToHistory('assistant', payload.text);
        break;

      case 'audio_chunk':
        get().playAudioChunk(payload.audio);
        set({ isSpeaking: true });
        break;

      case 'audio_complete':
        set({ isSpeaking: false });
        break;

      case 'interrupted':
        set({ isSpeaking: false });
        get().stopAudio();
        break;

      case 'metrics':
        set({ metrics: payload.metrics });
        break;

      case 'error':
        console.error('Server error:', payload.error);
        set({ isProcessing: false, isRecording: false });
        break;
    }
  },

  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          get().sendAudioChunk(event.data);
        }
      };

      mediaRecorder.start(100); // Send chunks every 100ms

      set({ 
        mediaRecorder,
        isRecording: true 
      });

      // Tell server recording started
      get().send({ type: 'start_recording' });

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access denied. Please allow microphone access.');
    }
  },

  stopRecording: () => {
    const { mediaRecorder } = get();
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    get().send({ type: 'stop_recording' });
    
    set({ 
      mediaRecorder: null,
      isRecording: false 
    });
  },

  sendAudioChunk: async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    get().send({
      type: 'audio_chunk',
      payload: base64
    });
  },

  playAudioChunk: async (base64Audio) => {
    try {
      // Decode base64 to array buffer
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create audio context if needed
      let { audioContext, audioQueue } = get();
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        set({ audioContext });
      }

      // Decode and play audio
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();

      // Track in queue
      audioQueue.push(source);
      set({ audioQueue });

      source.onended = () => {
        const queue = get().audioQueue.filter(s => s !== source);
        set({ audioQueue: queue });
      };

    } catch (error) {
      console.error('Error playing audio:', error);
    }
  },

  stopAudio: () => {
    const { audioQueue } = get();
    audioQueue.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    set({ audioQueue: [], isSpeaking: false });
  },

  interrupt: () => {
    get().stopAudio();
    get().send({ type: 'interrupt' });
  },

  addToHistory: (role, content) => {
    const { conversationHistory } = get();
    set({
      conversationHistory: [
        ...conversationHistory,
        {
          role,
          content,
          timestamp: Date.now()
        }
      ]
    });
  },

  clearHistory: () => {
    set({ conversationHistory: [] });
    get().send({ type: 'clear_history' });
  },

  send: (data) => {
    const { ws } = get();
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }
}));
