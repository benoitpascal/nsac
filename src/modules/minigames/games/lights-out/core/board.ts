/** A square control panel of lights, listed row by row; true means the light is on. */
export type Board = { size: number; lights: readonly boolean[] };

/** A light and its four neighbours, as row and column offsets. */
const PRESS_PATTERN = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/** Returns a panel of the given size with every light off. */
export const darkBoard = (size: number): Board => ({
  size,
  lights: Array.from({ length: size * size }, () => false),
});

const isInside = (size: number, row: number, column: number) =>
  row >= 0 && row < size && column >= 0 && column < size;

const touchedBy = (size: number, index: number) => {
  const row = Math.floor(index / size);
  const column = index % size;
  return PRESS_PATTERN.map(([rowStep, columnStep]) => [row + rowStep, column + columnStep] as const)
    .filter(([touchedRow, touchedColumn]) => isInside(size, touchedRow, touchedColumn))
    .map(([touchedRow, touchedColumn]) => touchedRow * size + touchedColumn);
};

/** Returns the panel after pressing a light: it and its four neighbours switch over. */
export const pressLight = (board: Board, index: number): Board => {
  const touched = new Set(touchedBy(board.size, index));
  return { ...board, lights: board.lights.map((lit, at) => (touched.has(at) ? !lit : lit)) };
};

/** Counts the lights still on. */
export const litCount = (board: Board) => board.lights.filter(Boolean).length;

/** Tells whether every light of the panel is off. */
export const isDark = (board: Board) => litCount(board) === 0;
