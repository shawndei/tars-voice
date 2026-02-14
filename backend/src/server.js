import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { VoiceSessionManager } from './voiceSession.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const sessionId = new URL(req.url, 'http://localhost').searchParams.get('sessionId');
  logger.info(`New WebSocket connection: ${sessionId || 'unknown'}`);

  const session = new VoiceSessionManager(ws, sessionId);

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      await session.handleMessage(data);
    } catch (error) {
      logger.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        error: error.message 
      }));
    }
  });

  ws.on('close', () => {
    logger.info(`WebSocket closed: ${sessionId}`);
    session.cleanup();
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
    session.cleanup();
  });

  // Send welcome message
  ws.send(JSON.stringify({ 
    type: 'connected', 
    sessionId: session.sessionId,
    message: 'TARS voice assistant ready'
  }));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`TARS Voice Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
