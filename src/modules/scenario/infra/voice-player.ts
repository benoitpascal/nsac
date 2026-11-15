import type { Voice } from '../core/voice';
import { voiceKey } from '@/shared/voice-key';

const MUTE_KEY = 'arcadia.voiceMuted';

const readMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
};

const writeMuted = (muted: boolean) => {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    // The choice then only lasts for this page.
  }
};

/**
 * Plays the mascot's recorded lines from public/voices/, made beforehand by
 * scripts/generate-voices.mjs. A line without a recording, or a browser that refuses to play,
 * stays silent: the text is always on screen.
 */
export const createVoicePlayer = (): Voice => {
  const audio = new Audio();
  let muted = readMuted();
  let recorded = new Set<string>();
  let wanted: string | undefined;
  const listeners = new Set<(speaking: boolean) => void>();
  const tell = (speaking: boolean) => listeners.forEach((listener) => listener(speaking));
  audio.addEventListener('playing', () => tell(true));
  audio.addEventListener('pause', () => tell(false));
  audio.addEventListener('ended', () => tell(false));
  const play = (text: string, evenMuted = false) => {
    const key = voiceKey(text);
    if ((muted && !evenMuted) || !recorded.has(key)) return;
    audio.src = `/voices/${key}.mp3`;
    audio.play().catch((error: unknown) => {
      // The browser blocks sound until the player touches the page (a line said as a page opens):
      // say it at their first key or click, unless another line came in the meantime.
      if (!(error instanceof DOMException) || error.name !== 'NotAllowedError') return;
      const retry = () => {
        if (wanted === text) play(text, evenMuted);
      };
      window.addEventListener('pointerdown', retry, { once: true });
      window.addEventListener('keydown', retry, { once: true });
    });
  };
  fetch('/voices/manifest.json')
    .then((response) => response.json() as Promise<{ lines: Record<string, string> }>)
    .then((manifest) => {
      recorded = new Set(Object.keys(manifest.lines));
      if (wanted) play(wanted);
    })
    .catch(() => undefined);
  const stop = () => {
    wanted = undefined;
    audio.pause();
  };
  return {
    say: (text) => {
      stop();
      wanted = text;
      play(text);
    },
    repeat: (text) => {
      stop();
      wanted = text;
      play(text, true);
    },
    stop,
    isMuted: () => muted,
    setMuted: (next) => {
      muted = next;
      writeMuted(next);
      if (next) audio.pause();
    },
    onSpeaking: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};
