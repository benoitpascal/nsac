// Records the mascot's lines with ElevenLabs into public/voices/, once, before the build: the site
// is static, so the API key never reaches the browser. Lines already recorded with the same voice
// are kept; recordings of lines that no longer exist are deleted.
//
//   ELEVEN_LABS_API_KEY=... pnpm voices        (or put the key in .env)
//   pnpm voices --dry-run                      (lists what would be recorded, no API call)
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const VOICE = { name: 'Liam', id: 'TX3LPaxmHKxFdv7VOQHJ', model: 'eleven_multilingual_v2' };
const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = `${root}public/voices/`;
const manifestPath = `${outDir}manifest.json`;
const dryRun = process.argv.includes('--dry-run');

if (existsSync(`${root}.env`)) process.loadEnvFile(`${root}.env`);
const apiKey = process.env.ELEVEN_LABS_API_KEY;
if (!apiKey && !dryRun) {
  console.error('ELEVEN_LABS_API_KEY is missing (environment or .env).');
  process.exit(1);
}

const server = await createServer({ root, server: { middlewareMode: true }, logLevel: 'error' });
const load = (path) => server.ssrLoadModule(path);
const [{ MOON_ACT }, { actVoiceLines }, { earthRadioVoiceLines }, { voiceKey }] =
  await Promise.all([
    load('/src/modules/scenario/core/act-moon.ts'),
    load('/src/modules/scenario/core/voice-lines.ts'),
    load('/src/modules/planet-walk/core/sky/earth-radio-lines.ts'),
    load('/src/shared/voice-key.ts'),
  ]);
await server.close();

const lines = Object.fromEntries(
  [...actVoiceLines(MOON_ACT), ...earthRadioVoiceLines()].map((text) => [voiceKey(text), text]),
);
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
const sameVoice = previous.voice?.id === VOICE.id && previous.voice?.model === VOICE.model;
const todo = Object.keys(lines).filter(
  (key) => !(sameVoice && previous.lines?.[key] && existsSync(`${outDir}${key}.mp3`)),
);
const chars = todo.reduce((sum, key) => sum + lines[key].length, 0);
console.log(`${Object.keys(lines).length} lines, ${todo.length} to record (${chars} characters).`);
if (dryRun) {
  todo.forEach((key) => console.log(`  ${key}  ${lines[key]}`));
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
for (const key of todo) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE.id}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lines[key], model_id: VOICE.model }),
    },
  );
  if (!response.ok) {
    console.error(`Failed on "${lines[key]}": ${response.status} ${await response.text()}`);
    process.exit(1);
  }
  writeFileSync(`${outDir}${key}.mp3`, Buffer.from(await response.arrayBuffer()));
  console.log(`  recorded ${key}`);
}

for (const file of readdirSync(outDir)) {
  if (file.endsWith('.mp3') && !lines[file.slice(0, -4)]) rmSync(`${outDir}${file}`);
}
writeFileSync(manifestPath, `${JSON.stringify({ voice: VOICE, lines }, null, 2)}\n`);
console.log('Done: public/voices/manifest.json');
