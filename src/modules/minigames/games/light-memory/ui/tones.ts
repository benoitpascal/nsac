/** Notes of the lights (Hz): G4, C5, E5, G5, a calm major chord. */
const FREQUENCIES = [392, 523.25, 659.25, 783.99];
/** Loudness of a tone, kept quiet. */
const VOLUME = 0.08;
/** Fade in and out of a tone (s), to avoid clicks. */
const FADE_S = 0.03;
const MS_PER_S = 1000;

/** Short tones played with the lights; silent when audio is unavailable. */
export type Tones = {
  /** Creates or wakes the audio, to call from a user gesture. */
  unlock: () => void;
  play: (light: number, ms: number) => void;
  close: () => void;
};

const ignore = () => undefined;

const sound = (context: AudioContext, frequency: number, ms: number) => {
  const start = context.currentTime;
  const end = start + ms / MS_PER_S;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(VOLUME, start + FADE_S);
  gain.gain.setValueAtTime(VOLUME, Math.max(start + FADE_S, end - FADE_S));
  gain.gain.linearRampToValueAtTime(0, end);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end);
};

/** Creates the tones; the audio context only exists after `unlock` and ends with `close`. */
export const createTones = (): Tones => {
  let context: AudioContext | undefined;
  let closed = false;
  return {
    unlock: () => {
      if (closed) return;
      try {
        context ??= new AudioContext();
        if (context.state === 'suspended') context.resume().catch(ignore);
      } catch {
        context = undefined;
      }
    },
    play: (light, ms) => {
      const frequency = FREQUENCIES[light];
      if (!context || frequency === undefined) return;
      try {
        sound(context, frequency, ms);
      } catch {
        ignore();
      }
    },
    close: () => {
      closed = true;
      context?.close().catch(ignore);
      context = undefined;
    },
  };
};
