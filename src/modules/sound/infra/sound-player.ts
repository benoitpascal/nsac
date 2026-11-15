import { isSoundMuted, SOUND_SETTING_EVENT } from './sound-preferences';

/** The sound team's files, in public/audio/OST-Bruitages/. */
const sound = (file: string) => encodeURI(`/audio/OST-Bruitages/${file}`);

const EFFECTS = {
  click: sound('click button digital sci fi.wav'),
  back: sound('Beep-short.wav'),
  exit: sound('Hard-beep.wav'),
  launch: sound('Sci FI Button.wav'),
  objective: sound('check-objectif.mp3'),
  valid: sound('valid.mp3'),
  wrong: sound('Incorrect Answer Fail.wav'),
};
/** Each music, its volume (0 to 1) and whether it loops. */
const MUSIC = {
  title: { src: sound('OST-Ecran_titre.m4a'), volume: 0.35 },
  minigames: { src: sound('OST-MiniGames.m4a'), volume: 0.35 },
  /** The title of each new day: played once. */
  day: { src: sound('OST-day.m4a'), volume: 0.35, once: true },
  /** Inside the station: a quiet background, under the voices. */
  station: { src: sound('Lunar Lounge.m4a'), volume: 0.15 },
  /** On the station dashboard (the terminal): a quiet background, under the voices. */
  dashboard: { src: sound('Lunar Dashboard.m4a'), volume: 0.15 },
};
const EFFECT_VOLUME = 0.5;
/** How fast a music fades in or out (volume per second). */
const FADE_PER_SECOND = 0.5;
/** What counts as a button for the click sound. */
const CLICKABLE = 'button, a[href], [role="switch"]';

/** How far a repeated effect may be sped up or slowed down, which shifts its pitch. */
const REPEAT_RATE_SPREAD = 0.12;
/** The last effect played, to vary it when it comes again right after. */
let lastEffect: keyof typeof EFFECTS | undefined;

/**
 * Plays a short sound effect, unless the player turned the sound effects off. The same effect
 * played again right after is slightly faster or slower, so that its pitch changes.
 */
export const playEffect = (name: keyof typeof EFFECTS) => {
  if (isSoundMuted('effects')) return;
  const effect = new Audio(EFFECTS[name]);
  effect.volume = EFFECT_VOLUME;
  if (name === lastEffect) {
    effect.preservesPitch = false;
    effect.playbackRate = 1 + (Math.random() * 2 - 1) * REPEAT_RATE_SPREAD;
  }
  lastEffect = name;
  effect.play().catch(() => undefined);
};

const isEffect = (name: string | undefined): name is keyof typeof EFFECTS =>
  name !== undefined && name in EFFECTS;

/**
 * Plays a sound each time the player presses a button or a link of the page: the one named by
 * its `data-sound` (back, exit, launch…), the click otherwise.
 */
export const installClickSounds = () => {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target.closest(CLICKABLE) : null;
      if (!(target instanceof HTMLElement) || target.matches(':disabled, [aria-disabled="true"]'))
        return;
      const named = target.dataset.sound;
      playEffect(isEffect(named) ? named : 'click');
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
 * Plays a music for the whole page (in a loop, unless it is a one-off like the day's title), unless
 * the player turned the music off. When the
 * browser refuses to start it before the player has touched the page, it starts at the first
 * click or key.
 */
export const playMusic = (name: keyof typeof MUSIC) => {
  const track: { src: string; volume: number; once?: boolean } = MUSIC[name];
  const { src, volume } = track;
  const music = new Audio(src);
  current = music;
  music.loop = !track.once;
  music.volume = volume;
  if (!isSoundMuted('music')) tryToPlay(music);
  let heard = true;
  let fading = 0;
  return {
    /** Fades the music in (true) or out (false), as when the astronaut steps in or out. */
    setHeard: (on: boolean) => {
      if (on === heard) return;
      heard = on;
      window.clearInterval(fading);
      const step = (FADE_PER_SECOND * volume) / 20;
      fading = window.setInterval(() => {
        const target = heard ? volume : 0;
        const next = music.volume + Math.sign(target - music.volume) * step;
        music.volume = Math.min(
          volume,
          Math.max(0, Math.abs(target - next) < step ? target : next),
        );
        if (music.volume === target) window.clearInterval(fading);
      }, 50);
    },
  };
};

/** Stops or starts again the page's music as soon as the player switches the music off or on. */
const followMusicSetting = () => {
  if (!current) return;
  if (isSoundMuted('music')) current.pause();
  else tryToPlay(current);
};
window.addEventListener(SOUND_SETTING_EVENT, followMusicSetting);
