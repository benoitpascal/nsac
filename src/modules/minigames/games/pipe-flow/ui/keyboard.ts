const MOVES: Record<string, { row: number; column: number }> = {
  ArrowUp: { row: -1, column: 0 },
  ArrowDown: { row: 1, column: 0 },
  ArrowLeft: { row: 0, column: -1 },
  ArrowRight: { row: 0, column: 1 },
};

const clamp = (value: number, size: number) => Math.min(size - 1, Math.max(0, value));

/** Moves the keyboard focus to the tile at the given index; only that tile is reachable by Tab. */
export const focusTile = (tiles: readonly HTMLButtonElement[], index: number) => {
  tiles.forEach((tile, at) => (tile.tabIndex = at === index ? 0 : -1));
  tiles[index]?.focus();
};

/**
 * Lets the arrow keys move the focus between the tiles of a square grid; Space and Enter press
 * the focused tile as any button.
 */
export const listenArrowKeys = (
  grid: HTMLElement,
  tiles: readonly HTMLButtonElement[],
  size: number,
) => {
  grid.addEventListener('keydown', (event) => {
    const move = MOVES[event.key] as (typeof MOVES)[string] | undefined;
    const current = tiles.findIndex((tile) => tile === document.activeElement);
    if (!move || current < 0) return;
    event.preventDefault();
    const row = clamp(Math.floor(current / size) + move.row, size);
    const column = clamp((current % size) + move.column, size);
    focusTile(tiles, row * size + column);
  });
};
