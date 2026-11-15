import type { Board, Mirror, Point } from './board';

/**
 * The traced laser: the cells it crosses in order (starting at the emitter), where it ends
 * (a cell edge when blocked, in cell coordinates) and which receivers it lights.
 */
export type Beam = { cells: readonly Point[]; end: Point; lit: readonly boolean[] };

const HALF_CELL = 0.5;

const keyOf = (point: Point) => `${point.x},${point.y}`;

const reflect = (mirror: Mirror, step: Point): Point =>
  mirror === '/' ? { x: -step.y, y: -step.x } : { x: step.y, y: step.x };

const isInside = (board: Board, point: Point) =>
  point.x >= 0 && point.y >= 0 && point.x < board.width && point.y < board.height;

/**
 * Follows the laser cell by cell from the emitter: mirrors turn it, receivers let it through,
 * walls, the emitter and the board edge stop it, and it stops when it loops back on itself.
 */
export const traceBeam = (board: Board, leans: readonly Mirror[]): Beam => {
  const blockers = new Set([...board.walls, board.emitter].map(keyOf));
  const mirrors = new Map(board.mirrors.map((point, index) => [keyOf(point), leans[index]]));
  const seen = new Set<string>();
  const cells: Point[] = [board.emitter];
  let at = board.emitter;
  let step = board.heading;
  for (;;) {
    const next = { x: at.x + step.x, y: at.y + step.y };
    const blocked = !isInside(board, next) || blockers.has(keyOf(next));
    const state = `${keyOf(next)}>${keyOf(step)}`;
    if (blocked || seen.has(state)) {
      const end = blocked ? { x: at.x + step.x * HALF_CELL, y: at.y + step.y * HALF_CELL } : next;
      const crossed = new Set(cells.map(keyOf));
      return { cells, end, lit: board.receivers.map((receiver) => crossed.has(keyOf(receiver))) };
    }
    seen.add(state);
    cells.push(next);
    at = next;
    const mirror = mirrors.get(keyOf(next));
    if (mirror) step = reflect(mirror, step);
  }
};

/** Tells whether the beam lights every receiver. */
export const isSolved = (beam: Beam) => beam.lit.every(Boolean);
