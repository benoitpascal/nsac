import { EARTH_RADIO_LINES, EARTH_RADIO_SPEECH } from '../../core/sky/earth-radio-lines';
import type { Voice } from '@/modules/scenario/core/voice';

/** How long (ms) the radio message stays on screen. */
const SHOWN_FOR_MS = 16000;

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

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

export type EarthRadioOptions = {
  now: () => number;
  /** Whether the message was already heard on that game day (YYYY-MM-DD). */
  heard: (day: string) => boolean;
  markHeard: (day: string) => void;
  /** The mascot's voice, which reads the message unless the player turned the voices off. */
  voice: Voice;
};

/**
 * The first time each game day the astronaut walks out of the base, the radio crackles and the base
 * reminds them that the sky is real: the Earth stands high above the base and never moves.
 */
export const createEarthRadio = (element: HTMLElement, options: EarthRadioOptions) => {
  let wasOut = false;
  return {
    update: (wentOut: boolean) => {
      const steppedOut = wentOut && !wasOut;
      wasOut = wentOut;
      const day = new Date(options.now()).toISOString().slice(0, 10);
      if (!steppedOut || options.heard(day)) return;
      options.markHeard(day);
      const now = options.now();
      const lines = EARTH_RADIO_LINES;
      element.replaceChildren(
        Object.assign(document.createElement('p'), {
          className: 'earth-radio__title',
          textContent: `📻 Radio · Base · ${dateFormat.format(now)}`,
        }),
        ...lines.map((line) =>
          Object.assign(document.createElement('p'), {
            className: 'earth-radio__line',
            textContent: line,
          }),
        ),
      );
      element.hidden = false;
      if (!options.voice.isMuted()) {
        crackle();
        window.setTimeout(() => options.voice.say(EARTH_RADIO_SPEECH), 600);
      }
      window.setTimeout(() => (element.hidden = true), SHOWN_FOR_MS);
    },
  };
};
