import { isSolved, traceBeam } from '../core/beam';
import { fewestFlips, flipMirror, startRound } from '../core/round';
import { createBeamLayer } from './beam.view';
import { buildCells, showLean } from './cells.view';
import { wireArrowFocus } from './keyboard';
import type { Level } from '../core/board';

/** What a level reports: each flip, then its solving with the flips used and the fewest. */
export type LevelEvents = {
  onFlip: (flips: number) => void;
  onSolved: (flips: number, fewest: number) => void;
};

/** Shows a level in the stage: tapping a mirror flips it and the beam is traced again. */
export const mountLevel = (stage: HTMLElement, level: Level, events: LevelEvents) => {
  let round = startRound(level);
  const { board } = round;
  const cells = buildCells(board);
  const beam = createBeamLayer(board);
  const frame = document.createElement('div');
  frame.className = 'mg-laser-mirrors-board';
  frame.style.aspectRatio = `${board.width} / ${board.height}`;
  frame.append(cells.grid, beam.svg);
  const render = () => {
    cells.mirrors.forEach((button, index) => {
      const lean = round.leans[index];
      if (lean) showLean(button, lean);
    });
    const traced = traceBeam(board, round.leans);
    beam.draw(traced);
    cells.receivers.forEach((cell, index) => cell.classList.toggle('is-lit', traced.lit[index]));
    return isSolved(traced);
  };
  let solved = render();
  cells.mirrors.forEach((button, index) =>
    button.addEventListener('click', () => {
      if (solved) return;
      round = flipMirror(round, index);
      solved = render();
      events.onFlip(round.flips);
      if (!solved) return;
      frame.classList.add('is-solved');
      events.onSolved(round.flips, fewestFlips(board));
    }),
  );
  wireArrowFocus(cells.grid, cells.mirrors, board.mirrors);
  stage.replaceChildren(frame);
};
