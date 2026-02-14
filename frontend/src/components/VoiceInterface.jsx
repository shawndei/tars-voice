import React from 'react';
import { useVoiceStore } from '../store/voiceStore';
import VoiceOrb from './VoiceOrb';
import TranscriptDisplay from './TranscriptDisplay';
import MetricsDisplay from './MetricsDisplay';

function VoiceInterface() {
  const {
    isRecording,
    isProcessing,
    isSpeaking,
    startRecording,
    stopRecording,
    interrupt,
    currentTranscript,
    metrics
  } = useVoiceStore();

  const handleMouseDown = () => {
    if (!isRecording && !isProcessing && !isSpeaking) {
      startRecording();
    }
  };

  const handleMouseUp = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const handleInterrupt = () => {
    interrupt();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* Voice Orb */}
      <div className="mb-12">
        <VoiceOrb
          isRecording={isRecording}
          isProcessing={isProcessing}
          isSpeaking={isSpeaking}
        />
      </div>

      {/* Transcript Display */}
      <div className="w-full max-w-2xl mb-8">
        <TranscriptDisplay transcript={currentTranscript} />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-4">
        {/* Main Mic Button */}
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          disabled={isProcessing || isSpeaking}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center
            transition-all duration-200 transform
            ${isRecording 
              ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50' 
              : 'bg-tars-blue hover:bg-tars-blue/80 hover:scale-105'
            }
            ${(isProcessing || isSpeaking) 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer active:scale-95'
            }
            border-4 border-white/20
          `}
        >
          <svg 
            className="w-10 h-10 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>

        <p className="text-sm text-gray-400">
          {isRecording && 'Recording... Release to send'}
          {isProcessing && 'Processing your message...'}
          {isSpeaking && 'TARS is speaking...'}
          {!isRecording && !isProcessing && !isSpeaking && 'Press and hold to speak'}
        </p>

        {/* Interrupt Button */}
        {isSpeaking && (
          <button
            onClick={handleInterrupt}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 
                       border border-red-500/50 rounded-lg 
                       transition-colors text-sm font-medium"
          >
            Stop TARS
          </button>
        )}
      </div>

      {/* Metrics */}
      <div className="mt-12">
        <MetricsDisplay metrics={metrics} />
      </div>
    </div>
  );
}

export default VoiceInterface;
