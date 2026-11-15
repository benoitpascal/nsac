import type { IntroShot } from '../core/intro-shots';

/** How long past its own length a video may hold the screen, in case it never reports its end. */
const VIDEO_SAFETY_MARGIN_MS = 3000;
/** Used while the video's length is not known yet. */
const UNKNOWN_LENGTH_MS = 15000;

/** A shot drawn on screen: `play` shows it and calls `onDone` once, when it is over. */
export type ShotLayer = {
  element: HTMLElement;
  play: (onDone: () => void) => void;
  stop: () => void;
};

const createVideoLayer = (shot: IntroShot): ShotLayer => {
  const video = document.createElement('video');
  Object.assign(video, { src: shot.src, playsInline: true, preload: 'auto' });
  video.className = 'moon-intro__shot';
  video.setAttribute('aria-label', shot.label);
  let timer = 0;
  return {
    element: video,
    play: (onDone) => {
      const finish = () => {
        window.clearTimeout(timer);
        onDone();
      };
      const length = Number.isFinite(video.duration) ? video.duration * 1000 : UNKNOWN_LENGTH_MS;
      timer = window.setTimeout(finish, length + VIDEO_SAFETY_MARGIN_MS);
      video.addEventListener('ended', finish, { once: true });
      // With its sound when the browser allows it, muted otherwise.
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(finish);
      });
    },
    stop: () => {
      window.clearTimeout(timer);
      video.pause();
    },
  };
};

const createStillLayer = (shot: Extract<IntroShot, { kind: 'still' }>): ShotLayer => {
  const image = document.createElement('img');
  Object.assign(image, { src: shot.src, alt: shot.label });
  image.className = 'moon-intro__shot moon-intro__shot--still';
  image.style.setProperty('--still-duration', `${shot.durationMs}ms`);
  let timer = 0;
  return {
    element: image,
    play: (onDone) => {
      timer = window.setTimeout(onDone, shot.durationMs);
    },
    stop: () => window.clearTimeout(timer),
  };
};

/** Builds the on-screen layer of a shot, hidden until it plays. */
export const createShotLayer = (shot: IntroShot): ShotLayer =>
  shot.kind === 'video' ? createVideoLayer(shot) : createStillLayer(shot);
