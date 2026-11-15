import '../laser-mirrors.css';
import { LEVELS } from '../core/levels';
import { scoreFor } from '../core/round';
import { createHud } from './hud.view';
import { mountLevel } from './level.view';
import type { MiniGameResult, StopGame } from '../../../core/minigame';

/** Pause (ms) on a solved level, receivers lit, before the next one appears. */
const NEXT_LEVEL_DELAY_MS = 1200;

/**
 * Plays the levels one after the other and finishes, won, after the last one with a score
 * comparing the flips used to the fewest possible.
 */
export const startLaserMirrors = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
): StopGame => {
  let timer: number | undefined;
  let fewest = 0;
  let used = 0;
  const hud = createHud(LEVELS.length);
  const stage = document.createElement('div');
  stage.className = 'mg-laser-mirrors-stage';
  const root = document.createElement('div');
  root.className = 'mg-laser-mirrors';
  root.append(hud.element, stage);
  container.replaceChildren(root);
  const play = (index: number) => {
    const level = LEVELS[index];
    if (!level) {
      finish({ won: true, score: scoreFor(fewest, used) });
      return;
    }
    hud.show(index + 1, 0);
    mountLevel(stage, level, {
      onFlip: (flips) => hud.show(index + 1, flips),
      onSolved: (flips, least) => {
        used += flips;
        fewest += least;
        timer = window.setTimeout(() => play(index + 1), NEXT_LEVEL_DELAY_MS);
      },
    });
  };
  play(0);
  return () => {
    window.clearTimeout(timer);
    container.replaceChildren();
  };
};
