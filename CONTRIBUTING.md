# Contributing to TARS Voice App

Thank you for your interest in contributing! 🎉

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Submitting Changes](#submitting-changes)
6. [Code Style](#code-style)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to learn and improve.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR-USERNAME/voice-conversation-app`
3. **Create a branch**: `git checkout -b feature/your-feature-name`
4. **Make changes** (see below)
5. **Submit a PR** (Pull Request)

---

## Development Setup

Follow the [SETUP.md](docs/SETUP.md) guide to get the app running locally.

**Quick setup:**
```bash
# Backend
cd backend
npm install
cp .env.example .env
# Add your API keys to .env

# Frontend
cd ../frontend
npm install

# Start both
npm run dev
```

---

## Making Changes

### Backend Changes

**Location:** `backend/src/`

**Key files:**
- `server.js` - Main server
- `voiceSession.js` - Session logic
- `services/*.js` - STT, TTS, AI integrations

**Testing:**
```bash
cd backend
npm test
npm run dev  # Test manually
```

### Frontend Changes

**Location:** `frontend/src/`

**Key files:**
- `App.jsx` - Main app component
- `store/voiceStore.js` - State management
- `components/*.jsx` - UI components

**Testing:**
```bash
cd frontend
npm run dev  # Hot reload enabled
npm run build  # Test production build
```

### Documentation Changes

**Location:** `docs/*.md`

Please update documentation for:
- New features
- API changes
- Configuration changes
- Setup process changes

---

## Submitting Changes

### Before Submitting

- [ ] Code follows style guidelines (see below)
- [ ] Tests pass: `npm test`
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested locally

### Pull Request Process

1. **Update your branch:**
   ```bash
   git pull origin main
   git rebase main
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create PR:**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out PR template

### Commit Message Format

Use conventional commits:

- `feat: add new feature`
- `fix: resolve bug in X`
- `docs: update setup guide`
- `style: format code`
- `refactor: improve Y logic`
- `test: add tests for Z`
- `chore: update dependencies`

---

## Code Style

### JavaScript/JSX

- **ES6+ syntax** - Use modern JavaScript
- **2 spaces** for indentation
- **Semicolons** at end of statements
- **Single quotes** for strings
- **camelCase** for variables/functions
- **PascalCase** for components

**Example:**
```javascript
// Good ✅
const userName = 'TARS';
function greetUser(name) {
  return `Hello, ${name}`;
}

// Bad ❌
const user_name = "TARS"
function GreetUser(name) {
  return "Hello, " + name
}
```

### React Components

- **Functional components** with hooks
- **Props destructuring**
- **Organized imports**

**Example:**
```jsx
import React, { useState, useEffect } from 'react';
import { useVoiceStore } from '../store/voiceStore';

function MyComponent({ title, onAction }) {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="my-component">
      <h1>{title}</h1>
    </div>
  );
}

export default MyComponent;
```

### CSS/Tailwind

- Use Tailwind utility classes
- Group related classes
- Responsive design: `sm:`, `md:`, `lg:`

**Example:**
```jsx
<div className="
  flex items-center justify-center
  p-4 rounded-lg
  bg-tars-blue hover:bg-tars-blue/80
  transition-colors
  md:p-6
">
  Content
</div>
```

---

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Voice quality test
npm run test:voice

# Latency test
node ../tests/latency-test.js
```

### Writing Tests

**Location:** `tests/*.test.js`

**Example:**
```javascript
import { describe, test, expect } from '@jest/globals';

describe('My Feature', () => {
  test('should work correctly', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Manual Testing Checklist

Before submitting, test:
- [ ] Connection to backend
- [ ] Recording audio
- [ ] Transcript display
- [ ] Audio playback
- [ ] Interruption
- [ ] History sidebar
- [ ] Mobile responsive
- [ ] No console errors

---

## Documentation

### What to Document

- **New features** - How to use them
- **API changes** - Updated endpoints/messages
- **Configuration** - New environment variables
- **Setup changes** - New dependencies/steps

### Where to Add Docs

- **README.md** - High-level overview
- **docs/SETUP.md** - Installation/setup
- **docs/API.md** - API reference
- **docs/DEPLOYMENT.md** - Deployment
- **Code comments** - Complex logic

### Documentation Style

- Clear and concise
- Step-by-step instructions
- Code examples
- Screenshots when helpful

---

## Need Help?

- 📖 Read [documentation](README.md)
- 💬 Ask in [Discussions](https://github.com/your-repo/discussions)
- 🐛 Check [existing issues](https://github.com/your-repo/issues)
- 📧 Email: contribute@yourapp.com

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Appreciated greatly! 🙏

---

## Types of Contributions

We welcome:
- 🐛 **Bug fixes**
- ✨ **New features**
- 📖 **Documentation improvements**
- 🧪 **Test coverage**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance improvements**
- 🔒 **Security patches**

---

## Priority Features

Looking for ideas? Help with:
- [ ] Voice activity detection (VAD) improvement
- [ ] Multi-language support
- [ ] Custom wake word detection
- [ ] Conversation export
- [ ] Mobile native apps
- [ ] Voice cloning from audio samples
- [ ] Rate limiting middleware
- [ ] User authentication

---

Thank you for contributing! 🚀

**"That's what I do. I survive."** - TARS
