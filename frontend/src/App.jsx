import React, { useState, useEffect } from 'react';
import VoiceInterface from './components/VoiceInterface';
import ConversationHistory from './components/ConversationHistory';
import StatusIndicator from './components/StatusIndicator';
import { useVoiceStore } from './store/voiceStore';

function App() {
  const { 
    connectionStatus, 
    connect, 
    disconnect,
    conversationHistory 
  } = useVoiceStore();

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Auto-connect on mount
    connect();

    // Cleanup on unmount
    return () => disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-tars-dark flex flex-col">
      {/* Header */}
      <header className="bg-tars-gray border-b border-tars-blue/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-tars-blue">TARS</div>
            <div className="text-sm text-gray-400">Voice Assistant</div>
          </div>
          
          <div className="flex items-center space-x-4">
            <StatusIndicator status={connectionStatus} />
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-tars-blue/10 hover:bg-tars-blue/20 
                         border border-tars-blue/30 rounded-lg transition-colors
                         text-sm font-medium"
            >
              {showHistory ? 'Hide' : 'Show'} History
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Voice Interface */}
        <div className={`flex-1 transition-all duration-300 ${
          showHistory ? 'lg:mr-96' : ''
        }`}>
          <VoiceInterface />
        </div>

        {/* Conversation History Sidebar */}
        {showHistory && (
          <aside className="fixed right-0 top-[73px] bottom-0 w-full lg:w-96 
                           bg-tars-gray border-l border-tars-blue/20 
                           overflow-y-auto z-50 lg:z-0">
            <ConversationHistory 
              history={conversationHistory}
              onClose={() => setShowHistory(false)}
            />
          </aside>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-tars-gray border-t border-tars-blue/20 p-3 text-center">
        <p className="text-sm text-gray-500">
          Humor setting at 75%. Press and hold to speak.
        </p>
      </footer>
    </div>
  );
}

export default App;
