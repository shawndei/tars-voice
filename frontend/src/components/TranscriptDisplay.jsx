import React from 'react';

function TranscriptDisplay({ transcript }) {
  if (!transcript) return null;

  return (
    <div className="bg-tars-gray/50 border border-tars-blue/30 rounded-lg p-6">
      <div className="text-sm text-gray-400 mb-2">Live Transcript:</div>
      <div className="text-lg text-white leading-relaxed">
        {transcript}
      </div>
    </div>
  );
}

export default TranscriptDisplay;
