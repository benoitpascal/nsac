import type { Board, Mirror } from '../core/board';

/** The grid of cells, with the mirror buttons and receivers in reading order. */
export type BoardCells = {
  grid: HTMLElement;
  mirrors: readonly HTMLButtonElement[];
  receivers: readonly HTMLElement[];
};

const CELL = 'mg-laser-mirrors-cell';
const DEGREES_PER_RADIAN = 180 / Math.PI;

const keyOf = (x: number, y: number) => `${x},${y}`;

const plainCell = (kind: string) => {
  const cell = document.createElement('div');
  cell.className = `${CELL} ${CELL}--${kind}`;
  return cell;
};

const mirrorCell = () => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${CELL} ${CELL}--mirror`;
  button.setAttribute('aria-label', 'Mirror');
  return button;
};

/** Shows which way a mirror button leans. */
export const showLean = (button: HTMLButtonElement, lean: Mirror) => {
  button.classList.toggle('is-slash', lean === '/');
  button.classList.toggle('is-backslash', lean === '\\');
};

/** Builds the cells of a board: empty, wall, receiver, emitter (aimed) and mirror buttons. */
export const buildCells = (board: Board): BoardCells => {
  const kinds = new Map<string, string>([
    ...board.walls.map(({ x, y }) => [keyOf(x, y), 'wall'] as const),
    ...board.receivers.map(({ x, y }) => [keyOf(x, y), 'receiver'] as const),
    [keyOf(board.emitter.x, board.emitter.y), 'emitter'],
  ]);
  const mirrorKeys = new Set(board.mirrors.map(({ x, y }) => keyOf(x, y)));
  const grid = document.createElement('div');
  grid.className = 'mg-laser-mirrors-grid';
  grid.style.setProperty('--mg-laser-mirrors-columns', String(board.width));
  const mirrors: HTMLButtonElement[] = [];
  const receivers: HTMLElement[] = [];
  for (let y = 0; y < board.height; y += 1) {
    for (let x = 0; x < board.width; x += 1) {
      const key = keyOf(x, y);
      const kind = kinds.get(key) ?? 'empty';
      const cell = mirrorKeys.has(key) ? mirrorCell() : plainCell(kind);
      if (cell instanceof HTMLButtonElement) mirrors.push(cell);
      if (kind === 'receiver') receivers.push(cell);
      grid.append(cell);
    }
  }
  const aim = Math.atan2(board.heading.y, board.heading.x) * DEGREES_PER_RADIAN;
  grid.style.setProperty('--mg-laser-mirrors-aim', `${aim}deg`);
  return { grid, mirrors, receivers };
};
