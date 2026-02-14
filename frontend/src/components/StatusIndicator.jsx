import React from 'react';

function StatusIndicator({ status }) {
  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      text: 'Connected',
      pulse: true
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Connecting...',
      pulse: true
    },
    disconnected: {
      color: 'bg-red-500',
      text: 'Disconnected',
      pulse: false
    }
  };

  const config = statusConfig[status] || statusConfig.disconnected;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        {config.pulse && (
          <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping opacity-75`} />
        )}
      </div>
      <span className="text-sm text-gray-400">{config.text}</span>
    </div>
  );
}

export default StatusIndicator;
