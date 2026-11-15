import { moonAndEarthPhases } from '../../core/sky/phases';
import { lunation } from '../../core/sky/lunation';

/** How long (ms) the radio message stays on screen. */
const SHOWN_FOR_MS = 16000;

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Returns the radio message for that date: the Earth's real phase, and the Moon's seen from home. */
export const earthRadioMessage = (timestamp: number) => {
  const { earth, moon } = moonAndEarthPhases(lunation(timestamp));
  return [
    'Base to commander, do you copy?',
    "I know it might feel like a game. But it's not completely one.",
    `Look up at the Earth: today it is a ${earth} Earth.`,
    `Back home, people see a ${moon} Moon. Same sky, same day: ${dateFormat.format(timestamp)}.`,
  ];
};

/** A short burst of radio static. */
const crackle = () => {
  try {
    const audio = new AudioContext();
    const noise = audio.createBuffer(1, audio.sampleRate * 0.6, audio.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i += 1) samples[i] = (Math.random() * 2 - 1) * 0.15;
    const source = audio.createBufferSource();
    source.buffer = noise;
    source.connect(audio.destination);
    source.start();
  } catch {
    // No sound available: the message still shows.
  }
};

const speak = (lines: readonly string[]) => {
  try {
    const voice = new SpeechSynthesisUtterance(lines.join(' '));
    voice.lang = 'en-US';
    voice.rate = 0.95;
    window.speechSynthesis.speak(voice);
  } catch {
    // No speech available: the message still shows.
  }
};

export type EarthRadioOptions = {
  now: () => number;
  /** Whether the message was already heard in this game. */
  heard: () => boolean;
  markHeard: () => void;
  /** Whether the player turned the voices off. */
  muted: () => boolean;
};

/**
 * The first time the astronaut walks out of the base, the radio crackles and the base reminds
 * them that the sky is real: the Earth's phase today, and the Moon's phase people see from home.
 */
export const createEarthRadio = (element: HTMLElement, options: EarthRadioOptions) => {
  let done = options.heard();
  return {
    update: (outside: boolean) => {
      if (done || !outside) return;
      done = true;
      options.markHeard();
      const lines = earthRadioMessage(options.now());
      element.replaceChildren(
        Object.assign(document.createElement('p'), {
          className: 'earth-radio__title',
          textContent: '📻 Radio · Base',
        }),
        ...lines.map((line) =>
          Object.assign(document.createElement('p'), {
            className: 'earth-radio__line',
            textContent: line,
          }),
        ),
      );
      element.hidden = false;
      if (!options.muted()) {
        crackle();
        window.setTimeout(() => speak(lines), 600);
      }
      window.setTimeout(() => (element.hidden = true), SHOWN_FOR_MS);
    },
  };
};
