import type { Voice } from '@/modules/scenario/core/voice';

/** How long (ms) a radio message stays on screen. */
const SHOWN_FOR_MS = 16000;
/** Delay (ms) between the static and the voice. */
const VOICE_DELAY_MS = 600;

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

const line = (className: string, textContent: string) =>
  Object.assign(document.createElement('p'), { className, textContent });

/**
 * The base's radio: shows a message on screen for a while and, unless the player turned the
 * voices off, crackles and reads it aloud with the mascot's voice. A new message replaces the
 * one on screen.
 */
export const createRadioMessage = (element: HTMLElement, voice: Voice) => {
  let hideTimer: number | undefined;
  let voiceTimer: number | undefined;
  return {
    say: (title: string, lines: readonly string[], speech = lines.join(' ')) => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(voiceTimer);
      element.replaceChildren(
        line('earth-radio__title', title),
        ...lines.map((text) => line('earth-radio__line', text)),
      );
      element.hidden = false;
      if (!voice.isMuted()) {
        crackle();
        voiceTimer = window.setTimeout(() => voice.say(speech), VOICE_DELAY_MS);
      }
      hideTimer = window.setTimeout(() => (element.hidden = true), SHOWN_FOR_MS);
    },
  };
};

export type RadioMessage = ReturnType<typeof createRadioMessage>;
