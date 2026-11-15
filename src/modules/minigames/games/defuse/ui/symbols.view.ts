import { createSymbols, isSamePose } from '../core/symbols';
import { createButton, createElement, shake } from './panel';
import type { Random } from '../core/random';
import type { SymbolPose } from '../core/symbols';
import type { PanelEvents } from './panel';

const DEGREES_PER_QUARTER = 90;

const createPicture = (picture: string, pose: SymbolPose, className: string) => {
  const glyph = createElement('span', className, picture);
  const mirror = pose.mirrored ? ' scaleX(-1)' : '';
  glyph.style.transform = `rotate(${pose.quarterTurns * DEGREES_PER_QUARTER}deg)${mirror}`;
  return glyph;
};

/** Shows a picture to find among six turned or mirrored copies; picking the same one solves it. */
export const createSymbolsPanel = (random: Random, events: PanelEvents) => {
  const puzzle = createSymbols(random);
  const panel = createElement('div', 'mg-defuse-panel mg-defuse-symbols');
  const model = createElement('div', 'mg-defuse-rule mg-defuse-model');
  model.append(
    createElement('span', 'mg-defuse-scissors', '🔍'),
    createPicture(puzzle.picture, puzzle.target, 'mg-defuse-glyph'),
  );
  const grid = createElement('div', 'mg-defuse-choices');
  puzzle.choices.forEach((pose, index) => {
    const choice = createButton('mg-defuse-choice', '', `choice ${index + 1}`);
    choice.append(createPicture(puzzle.picture, pose, 'mg-defuse-glyph'));
    choice.addEventListener('click', () => {
      if (isSamePose(pose, puzzle.target)) events.solved();
      else {
        choice.disabled = true;
        events.mistake();
        shake(panel);
      }
    });
    grid.append(choice);
  });
  panel.append(model, grid);
  return panel;
};
