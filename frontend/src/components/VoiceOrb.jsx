import React from 'react';

function VoiceOrb({ isRecording, isProcessing, isSpeaking }) {
  let orbClass = 'bg-tars-blue';
  let animation = '';

  if (isRecording) {
    orbClass = 'bg-red-500';
    animation = 'animate-pulse';
  } else if (isProcessing) {
    orbClass = 'bg-yellow-500';
    animation = 'animate-pulse-slow';
  } else if (isSpeaking) {
    orbClass = 'bg-tars-blue';
    animation = 'animate-orb';
  }

  return (
    <div className="relative">
      {/* Outer glow rings */}
      <div className={`absolute inset-0 rounded-full ${orbClass} opacity-20 blur-xl ${animation}`} />
      <div className={`absolute inset-0 rounded-full ${orbClass} opacity-30 blur-2xl scale-125 ${animation}`} />
      
      {/* Main orb */}
      <div 
        className={`
          relative w-48 h-48 rounded-full ${orbClass} 
          shadow-2xl shadow-tars-blue/50
          ${animation}
          flex items-center justify-center
        `}
      >
        {/* Inner core */}
        <div className={`w-32 h-32 rounded-full ${orbClass} opacity-60 blur-md`} />
        
        {/* Center dot */}
        <div className="absolute w-4 h-4 rounded-full bg-white" />
      </div>

      {/* Pulse rings when speaking */}
      {isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-full border-4 border-tars-blue animate-ping opacity-75" />
          <div 
            className="absolute inset-0 rounded-full border-4 border-tars-blue animate-ping opacity-50" 
            style={{ animationDelay: '0.5s' }}
          />
        </>
      )}
    </div>
  );
}

export default VoiceOrb;
