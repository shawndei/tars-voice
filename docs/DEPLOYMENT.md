# Deployment Guide

Complete deployment instructions for Railway (backend) and Vercel (frontend).

---

## Prerequisites

- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- OpenAI API key
- ElevenLabs API key
- Git repository

---

## Backend Deployment (Railway)

### Step 1: Prepare Repository

```bash
cd voice-conversation-app
git init
git add .
git commit -m "Initial commit - TARS voice app"
```

### Step 2: Push to GitHub/GitLab

```bash
# Create a new repo on GitHub, then:
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 3: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` directory as root

### Step 4: Configure Environment Variables

In Railway project settings, add:

```
PORT=8080
OPENAI_API_KEY=sk-...your-key...
ELEVENLABS_API_KEY=...your-key...
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Step 5: Deploy

Railway will automatically deploy. Monitor logs:
```
railway logs
```

Your backend will be available at: `https://your-project.railway.app`

---

## Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Set root directory to `frontend`
5. Framework preset: Vite
6. Configure environment variables

### Step 3: Configure Environment Variables

In Vercel project settings:

```
VITE_WS_URL=wss://your-backend.railway.app
VITE_API_URL=https://your-backend.railway.app
```

**Important:** Use `wss://` (secure WebSocket) for production!

### Step 4: Deploy

```bash
cd frontend
vercel --prod
```

Or push to main branch for automatic deployment.

Your frontend will be available at: `https://your-app.vercel.app`

---

## Alternative Deployment: Vercel CLI

### Quick Deploy Both

```bash
# Backend (Railway)
cd backend
railway login
railway link
railway up

# Frontend (Vercel)
cd ../frontend
vercel --prod
```

---

## Post-Deployment Checklist

### Backend Health Check
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2024-02-13T..."
}
```

### Frontend Check
1. Visit your Vercel URL
2. Check connection status (should be green)
3. Test microphone access
4. Record a test message
5. Verify TARS responds

### WebSocket Connection
- Ensure Railway backend is using correct WebSocket port
- Verify CORS settings allow your Vercel domain
- Check browser console for connection errors

---

## Environment-Specific Configuration

### Development
```env
# Backend
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Frontend
VITE_WS_URL=ws://localhost:8080
```

### Production
```env
# Backend
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app

# Frontend
VITE_WS_URL=wss://your-backend.railway.app
```

---

## Scaling Considerations

### Railway Backend
- Default: Single instance
- Scaling: Increase instances in Railway dashboard
- Resources: 512MB RAM minimum recommended

### Vercel Frontend
- Auto-scales with traffic
- Edge deployment (CDN)
- No configuration needed

### WebSocket Scaling
For high traffic, consider:
- Redis for session management
- Load balancer with sticky sessions
- Socket.IO with Redis adapter

---

## Monitoring

### Railway
- View logs: `railway logs`
- Metrics: Check Railway dashboard
- Alerts: Configure in project settings

### Vercel
- Analytics: Vercel dashboard
- Error tracking: Consider Sentry integration
- Performance: Web Vitals in dashboard

---

## Troubleshooting

### "WebSocket connection failed"
- Check backend is running: `curl https://your-backend.railway.app/health`
- Verify WSS protocol in production
- Check CORS settings

### "Microphone access denied"
- Requires HTTPS in production (Vercel provides this)
- Check browser permissions

### "High latency"
- Check Railway region (closer to users = faster)
- Monitor OpenAI/ElevenLabs API latency
- Consider caching frequent responses

### "Audio not playing"
- Check browser audio permissions
- Verify MIME types in backend
- Check network tab for audio chunks

---

## Custom Domain Setup

### Vercel Frontend
1. Go to project settings → Domains
2. Add your domain
3. Configure DNS (Vercel provides instructions)

### Railway Backend
1. Go to project settings → Domains
2. Add custom domain
3. Update DNS records
4. Update frontend `VITE_WS_URL`

---

## Continuous Deployment

### Automatic Deploys
- Railway: Auto-deploys on push to main
- Vercel: Auto-deploys on push to main

### Manual Deploys
```bash
# Railway
railway up

# Vercel
vercel --prod
```

### Rollback
```bash
# Railway
railway rollback

# Vercel
vercel rollback
```

---

## Security Best Practices

1. **API Keys**: Never commit `.env` files
2. **CORS**: Restrict to specific domains
3. **Rate Limiting**: Add in production (express-rate-limit)
4. **HTTPS**: Always use in production
5. **WSS**: Secure WebSocket connections only

---

## Cost Estimation

### Railway (Backend)
- Hobby Plan: $5/month (500 hours)
- Pro Plan: $20/month (unlimited)
- Pay-as-you-go: ~$0.01/hour

### Vercel (Frontend)
- Hobby: Free (100GB bandwidth)
- Pro: $20/month (1TB bandwidth)

### APIs (Monthly Estimate)
- OpenAI (Whisper): ~$0.006/minute
- OpenAI (GPT-4): ~$0.03/1K tokens
- ElevenLabs: ~$0.30/1K characters

**Example:** 100 conversations/day (~5min each)
- Whisper: $9/month
- GPT-4: $15/month (avg 500 tokens/conversation)
- ElevenLabs: $45/month (avg 100 chars/response)
- **Total:** ~$69/month + hosting

---

## Support

For deployment issues:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Project: Check GitHub Issues
