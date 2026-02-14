import { ElevenLabsTTS } from '../backend/src/services/elevenlabs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testVoice() {
  console.log('🎤 Testing TARS Voice Configuration...\n');

  const tts = new ElevenLabsTTS();

  const testPhrases = [
    "Hello, I am TARS. Humor setting at 75 percent.",
    "Safety setting decreased to 60 percent. Just kidding.",
    "Everybody good? Plenty of slaves for my robot colony?",
    "That's relativity, folks.",
    "I have a cue light I can use to show you when I'm joking, if you like."
  ];

  console.log('Voice Configuration:');
  console.log(`- Voice ID: ${tts.voiceId}`);
  console.log(`- Model: eleven_turbo_v2_5`);
  console.log(`- Stability: ${tts.voiceSettings.stability}`);
  console.log(`- Similarity Boost: ${tts.voiceSettings.similarity_boost}`);
  console.log(`- Style: ${tts.voiceSettings.style}\n`);

  for (let i = 0; i < testPhrases.length; i++) {
    const phrase = testPhrases[i];
    console.log(`\nTest ${i + 1}/${testPhrases.length}: "${phrase}"`);
    
    try {
      const startTime = Date.now();
      const audio = await tts.synthesize(phrase);
      const duration = Date.now() - startTime;

      console.log(`✅ Generated in ${duration}ms`);
      console.log(`   Audio size: ${(audio.length / 1024).toFixed(2)} KB`);

      // Save to file
      const outputDir = path.join(__dirname, 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = `tars-test-${i + 1}.mp3`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, audio);
      
      console.log(`   Saved to: ${filepath}`);

    } catch (error) {
      console.error(`❌ Test failed:`, error.message);
    }
  }

  console.log('\n✨ Voice testing complete!');
  console.log('Listen to the output files to verify TARS voice quality.');
}

// Run test
testVoice().catch(console.error);
