import { isSoundMuted } from './sound-preferences';

/** The sound team's files, in public/audio/OST-Bruitages/. */
const sound = (file: string) => encodeURI(`/audio/OST-Bruitages/${file}`);

const EFFECTS = {
  click: sound('click button digital sci fi.wav'),
  objective: sound('check-objectif.mp3'),
};
const MUSIC = {
  title: sound('OST-Ecran_titre.m4a'),
  minigames: sound('OST-MiniGames.m4a'),
};
const EFFECT_VOLUME = 0.5;
const MUSIC_VOLUME = 0.35;
/** What counts as a button for the click sound. */
const CLICKABLE = 'button, a[href], [role="switch"]';

/** Plays a short sound effect, unless the player turned the sound effects off. */
export const playEffect = (name: keyof typeof EFFECTS) => {
  if (isSoundMuted('effects')) return;
  const effect = new Audio(EFFECTS[name]);
  effect.volume = EFFECT_VOLUME;
  effect.play().catch(() => undefined);
};

/** Plays the click sound each time the player presses a button or a link of the page. */
export const installClickSounds = () => {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target.closest(CLICKABLE) : null;
      if (target && !target.matches(':disabled, [aria-disabled="true"]')) playEffect('click');
    },
    { capture: true },
  );
};

/** The music of the page, once started. */
let current: HTMLAudioElement | undefined;

const tryToPlay = (music: HTMLAudioElement) => {
  music.play().catch(() => {
    const start = () => {
      if (!isSoundMuted('music')) music.play().catch(() => undefined);
    };
    window.addEventListener('pointerdown', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
  });
};

/**
 * Plays a music in a loop for the whole page, unless the player turned the music off. When the
 * browser refuses to start it before the player has touched the page, it starts at the first
 * click or key.
 */
export const playMusic = (name: keyof typeof MUSIC) => {
  current = new Audio(MUSIC[name]);
  current.loop = true;
  current.volume = MUSIC_VOLUME;
  if (!isSoundMuted('music')) tryToPlay(current);
};

/** Stops or starts again the page's music after the player switched the music off or on. */
export const followMusicSetting = () => {
  if (!current) return;
  if (isSoundMuted('music')) current.pause();
  else tryToPlay(current);
};
