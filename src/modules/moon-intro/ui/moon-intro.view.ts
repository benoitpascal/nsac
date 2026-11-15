import { createShotLayer } from './shot-layer.view';
import type { IntroShot } from '../core/intro-shots';

export type MoonIntroElements = {
  stage: HTMLElement;
};

const ACTIVE_CLASS = 'is-active';

/**
 * Plays the shots one after another in the stage, fading from one to the next, then opens
 * `nextPage`. A click anywhere or the Escape key opens it straight away.
 */
export const mountMoonIntro = (
  elements: MoonIntroElements,
  shots: readonly IntroShot[],
  nextPage: string,
) => {
  const layers = shots.map(createShotLayer);
  elements.stage.replaceChildren(...layers.map((layer) => layer.element));
  let current = -1;
  let leaving = false;

  const leave = () => {
    if (leaving) return;
    leaving = true;
    layers.forEach((layer) => layer.stop());
    window.location.assign(nextPage);
  };

  const playNext = () => {
    layers[current]?.element.classList.remove(ACTIVE_CLASS);
    current += 1;
    const layer = layers[current];
    if (!layer) {
      leave();
      return;
    }
    layer.element.classList.add(ACTIVE_CLASS);
    layer.play(playNext);
  };

  window.addEventListener('click', leave);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') leave();
  });
  playNext();
};
