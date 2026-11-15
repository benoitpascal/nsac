import { button } from './dom';
import type { Voice } from '../core/voice';

/** Figma « Frame 45 » speaker, 32 × 32: two waves when the sound is on, a slash when it is off. */
const BODY = '<path d="M2 10h6.5L16 2.5v27L8.5 22H2z" fill="currentColor"/>';
const WAVES =
  '<path class="voice-speaker__wave" d="M20.5 11a7 7 0 0 1 0 10" fill="none" stroke="currentColor" stroke-width="2.8"/><path class="voice-speaker__wave" d="M24.5 7a12.5 12.5 0 0 1 0 18" fill="none" stroke="currentColor" stroke-width="2.8"/>';
const ON = `<svg viewBox="0 0 32 32" aria-hidden="true">${BODY}${WAVES}</svg>`;
const OFF = `<svg viewBox="0 0 32 32" aria-hidden="true"><g opacity="0.45">${BODY}${WAVES}</g><path d="M4 28 28 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`;

/**
 * The sound button next to the mascot: turns its voice on or off, and its waves move while it
 * talks. Returns the button and how to stop following the voice.
 */
export const createVoiceSpeaker = (voice: Voice) => {
  const speaker = button('', 'voice-speaker', () => {
    voice.setMuted(!voice.isMuted());
    draw();
  });
  const draw = () => {
    speaker.innerHTML = voice.isMuted() ? OFF : ON;
    speaker.setAttribute('aria-label', voice.isMuted() ? 'Sound off' : 'Sound on');
    speaker.setAttribute('aria-pressed', String(!voice.isMuted()));
  };
  draw();
  const stop = voice.onSpeaking((speaking) =>
    speaker.classList.toggle('voice-speaker--speaking', speaking),
  );
  return { speaker, stop };
};
