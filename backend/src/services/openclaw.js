import { logger } from '../utils/logger.js';

export class OpenClawIntegration {
  constructor() {
    // OpenClaw session integration
    this.sessionId = process.env.OPENCLAW_SESSION_ID || null;
  }

  async chat(userMessage, conversationHistory = []) {
    try {
      const startTime = Date.now();

      // For now, we'll use OpenAI directly
      // In production, this would route through OpenClaw's agent system
      const response = await this.callOpenAI(userMessage, conversationHistory);

      const duration = Date.now() - startTime;
      logger.info(`OpenClaw chat completed in ${duration}ms`);

      return response;

    } catch (error) {
      logger.error('OpenClaw integration error:', error);
      throw new Error(`Chat failed: ${error.message}`);
    }
  }

  async callOpenAI(userMessage, conversationHistory) {
    // Using OpenAI as the LLM backend
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = [
      {
        role: 'system',
        content: `You are TARS, the robot from Interstellar. You are helpful, precise, and have a humor setting at 75%. 
Be concise in your responses since they will be spoken aloud. Keep responses under 2-3 sentences when possible.
Maintain TARS's personality: logical, efficient, occasionally witty.`
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      max_tokens: 150,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  }

  // Integration with OpenClaw's agent system
  async routeToAgent(message, context = {}) {
    // Placeholder for full OpenClaw integration
    // This would use OpenClaw's message routing system
    logger.info('Routing to OpenClaw agent:', message);
    return await this.chat(message, context.history || []);
  }
}
