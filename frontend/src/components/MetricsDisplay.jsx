import React from 'react';

function MetricsDisplay({ metrics }) {
  const { sttLatency, ttsLatency, totalLatency } = metrics;

  if (!totalLatency) return null;

  const formatLatency = (ms) => {
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;
  };

  const getLatencyColor = (ms) => {
    if (ms < 500) return 'text-green-400';
    if (ms < 1000) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center space-x-6 text-sm">
      <div className="flex flex-col items-center">
        <span className="text-gray-500 text-xs mb-1">STT</span>
        <span className={getLatencyColor(sttLatency)}>
          {formatLatency(sttLatency)}
        </span>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-gray-500 text-xs mb-1">TTS</span>
        <span className={getLatencyColor(ttsLatency)}>
          {formatLatency(ttsLatency)}
        </span>
      </div>
      
      <div className="flex flex-col items-center">
        <span className="text-gray-500 text-xs mb-1">Total</span>
        <span className={getLatencyColor(totalLatency) + ' font-bold'}>
          {formatLatency(totalLatency)}
        </span>
      </div>
    </div>
  );
}

export default MetricsDisplay;
