/** A mirror leans like / or like \ ; flipping it swaps the two. */
export type Mirror = '/' | '\\';
/** A grid cell, column x from the left and row y from the top; also a one-cell step. */
export type Point = { x: number; y: number };
/** Where the laser points when it leaves the emitter. */
export type Heading = 'up' | 'down' | 'left' | 'right';

/**
 * A handcrafted level: its map rows ('.' empty, '#' wall, 'R' receiver, 'E' emitter, '/' or '\'
 * a mirror in its starting lean), the emitter heading, and the mirror leans, in reading order,
 * that light every receiver.
 */
export type Level = { rows: readonly string[]; heading: Heading; solution: readonly Mirror[] };

/** A level ready to play, with mirrors listed in reading order. */
export type Board = {
  width: number;
  height: number;
  emitter: Point;
  heading: Point;
  walls: readonly Point[];
  receivers: readonly Point[];
  mirrors: readonly Point[];
  start: readonly Mirror[];
};

const STEPS: Record<Heading, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

type Cell = Point & { symbol: string };

const isMirror = (symbol: string): symbol is Mirror => symbol === '/' || symbol === '\\';

/** Returns the other lean of a mirror. */
export const flipped = (mirror: Mirror): Mirror => (mirror === '/' ? '\\' : '/');

/** Turns a level map into a board; throws when the map has no emitter. */
export const parseLevel = (level: Level): Board => {
  const cells: Cell[] = level.rows.flatMap((row, y) =>
    [...row].map((symbol, x) => ({ symbol, x, y })),
  );
  const at = (symbol: string) =>
    cells.filter((cell) => cell.symbol === symbol).map(({ x, y }) => ({ x, y }));
  const [emitter] = at('E');
  if (!emitter) throw new Error('A laser level needs an emitter (E).');
  const mirrorCells = cells.filter((cell) => isMirror(cell.symbol));
  return {
    width: level.rows[0]?.length ?? 0,
    height: level.rows.length,
    emitter,
    heading: STEPS[level.heading],
    walls: at('#'),
    receivers: at('R'),
    mirrors: mirrorCells.map(({ x, y }) => ({ x, y })),
    start: mirrorCells.map(({ symbol }) => (symbol === '/' ? '/' : '\\')),
  };
};
