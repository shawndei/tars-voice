import { WhisperSTT } from '../backend/src/services/whisper.js';
import { ElevenLabsTTS } from '../backend/src/services/elevenlabs.js';
import { OpenClawIntegration } from '../backend/src/services/openclaw.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testLatency() {
  console.log('⚡ Testing End-to-End Latency...\n');

  const stt = new WhisperSTT();
  const tts = new ElevenLabsTTS();
  const openclaw = new OpenClawIntegration();

  // Load test audio file (you'll need to provide one)
  const testAudioPath = path.join(__dirname, 'fixtures', 'test-audio.webm');
  
  if (!fs.existsSync(testAudioPath)) {
    console.log('⚠️  No test audio file found.');
    console.log(`   Please record a sample and save it to:`);
    console.log(`   ${testAudioPath}`);
    console.log('\n   Simulating with text instead...\n');
    await testWithText();
    return;
  }

  const audioBuffer = fs.readFileSync(testAudioPath);

  console.log('Starting full pipeline test...\n');
  const startTime = Date.now();

  try {
    // Step 1: STT
    console.log('1. Speech to Text (Whisper)...');
    const sttStart = Date.now();
    const transcript = await stt.transcribe(audioBuffer);
    const sttLatency = Date.now() - sttStart;
    console.log(`   ✅ Transcribed in ${sttLatency}ms: "${transcript}"\n`);

    // Step 2: LLM Response
    console.log('2. Getting AI response...');
    const llmStart = Date.now();
    const response = await openclaw.chat(transcript, []);
    const llmLatency = Date.now() - llmStart;
    console.log(`   ✅ Response in ${llmLatency}ms: "${response}"\n`);

    // Step 3: TTS
    console.log('3. Text to Speech (ElevenLabs)...');
    const ttsStart = Date.now();
    const audio = await tts.synthesize(response);
    const ttsLatency = Date.now() - ttsStart;
    console.log(`   ✅ Synthesized in ${ttsLatency}ms (${(audio.length / 1024).toFixed(2)} KB)\n`);

    // Total latency
    const totalLatency = Date.now() - startTime;

    console.log('📊 Latency Summary:');
    console.log(`   STT:   ${sttLatency}ms`);
    console.log(`   LLM:   ${llmLatency}ms`);
    console.log(`   TTS:   ${ttsLatency}ms`);
    console.log(`   ─────────────────────`);
    console.log(`   TOTAL: ${totalLatency}ms`);
    
    if (totalLatency < 1000) {
      console.log('\n   ✅ Excellent! Under 1 second target');
    } else if (totalLatency < 2000) {
      console.log('\n   ⚠️  Acceptable but could be improved');
    } else {
      console.log('\n   ❌ Too slow - optimization needed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function testWithText() {
  const tts = new ElevenLabsTTS();
  const openclaw = new OpenClawIntegration();

  const testMessage = "What's the status of the mission?";
  
  console.log(`Test input: "${testMessage}"\n`);
  const startTime = Date.now();

  try {
    // LLM Response
    console.log('1. Getting AI response...');
    const llmStart = Date.now();
    const response = await openclaw.chat(testMessage, []);
    const llmLatency = Date.now() - llmStart;
    console.log(`   ✅ Response in ${llmLatency}ms: "${response}"\n`);

    // TTS
    console.log('2. Text to Speech...');
    const ttsStart = Date.now();
    const audio = await tts.synthesize(response);
    const ttsLatency = Date.now() - ttsStart;
    console.log(`   ✅ Synthesized in ${ttsLatency}ms\n`);

    const totalLatency = Date.now() - startTime;

    console.log('📊 Latency Summary (without STT):');
    console.log(`   LLM:   ${llmLatency}ms`);
    console.log(`   TTS:   ${ttsLatency}ms`);
    console.log(`   ─────────────────────`);
    console.log(`   TOTAL: ${totalLatency}ms`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testLatency().catch(console.error);
