/** The sounds the player can turn on or off apart from the voices. */
export type SoundChannel = 'effects' | 'music';

const KEYS: Record<SoundChannel, string> = {
  effects: 'arcadia.effectsMuted',
  music: 'arcadia.musicMuted',
};

/** Whether the player turned that kind of sound off; on by default. */
export const isSoundMuted = (channel: SoundChannel) => {
  try {
    return localStorage.getItem(KEYS[channel]) === '1';
  } catch {
    return false;
  }
};

/** Saves whether that kind of sound is off. */
export const setSoundMuted = (channel: SoundChannel, muted: boolean) => {
  try {
    localStorage.setItem(KEYS[channel], muted ? '1' : '0');
  } catch {
    // The choice then only lasts for this page.
  }
};
