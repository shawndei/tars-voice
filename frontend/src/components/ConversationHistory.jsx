import React from 'react';
import { useVoiceStore } from '../store/voiceStore';

function ConversationHistory({ history, onClose }) {
  const { clearHistory } = useVoiceStore();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-tars-blue/20">
        <h2 className="text-lg font-semibold text-tars-blue">Conversation History</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearHistory}
            className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 
                       border border-red-500/50 rounded transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="lg:hidden px-3 py-1 text-sm bg-tars-blue/20 hover:bg-tars-blue/30 
                       border border-tars-blue/50 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No conversation yet.</p>
            <p className="text-sm mt-2">Start speaking to TARS!</p>
          </div>
        ) : (
          history.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-lg p-3 
                  ${message.role === 'user'
                    ? 'bg-tars-blue/20 border border-tars-blue/30'
                    : 'bg-tars-gray border border-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-semibold text-tars-blue">
                    {message.role === 'user' ? 'You' : 'TARS'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationHistory;
