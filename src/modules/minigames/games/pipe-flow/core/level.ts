import { SOURCE_SIDE, TANK_SIDE, isSolved } from './flow';
import { indexOf, randomIndex, sideTowards } from './grid';
import { randomPath } from './path';
import { SIDES, oppositeOf, turnsToMatch } from './tiles';
import type { Board } from './flow';
import type { Cell, Random } from './grid';
import type { Side, Tile, TileKind } from './tiles';

/** A board to solve, with the fewest turns its hidden route needs (the par). */
export type Level = Board & { par: number };

type RouteStep = { index: number; sides: Side[] };

/** Shapes laid on cells off the route; corners are twice as likely, some cells stay empty. */
const FILLER_KINDS: readonly TileKind[] = ['straight', 'corner', 'corner', 'tee', 'cross', 'empty'];

const routeSteps = (path: readonly Cell[], size: number): RouteStep[] =>
  path.map((cell, step) => {
    const entry = step === 0 ? SOURCE_SIDE : sideTowards(cell, path[step - 1]);
    const exit = step === path.length - 1 ? TANK_SIDE : sideTowards(cell, path[step + 1]);
    return { index: indexOf(cell, size), sides: [entry, exit] };
  });

const routeKind = (sides: readonly Side[]): TileKind =>
  sides[1] === oppositeOf(sides[0]) ? 'straight' : 'corner';

const scramble = (tiles: readonly Tile[], random: Random): Tile[] =>
  tiles.map((tile) => ({ ...tile, turns: randomIndex(random, SIDES) }));

/**
 * Builds a random level: a winding pipe route from the ice drill on the left edge to the tank on
 * the right edge, random pipes everywhere else, then every tile turned at random so that the
 * water does not reach the tank yet.
 */
export const generateLevel = (size: number, random: Random): Level => {
  const source = { row: randomIndex(random, size), column: 0 };
  const tank = { row: randomIndex(random, size), column: size - 1 };
  const route = routeSteps(randomPath(source, tank, size, random), size);
  const tiles: Tile[] = Array.from({ length: size * size }, () => ({
    kind: FILLER_KINDS[randomIndex(random, FILLER_KINDS.length)],
    turns: 0,
  }));
  route.forEach(({ index, sides }) => (tiles[index] = { kind: routeKind(sides), turns: 0 }));
  let board: Board = { size, tiles: scramble(tiles, random), source, tank };
  while (isSolved(board)) board = { ...board, tiles: scramble(tiles, random) };
  const par = route.reduce(
    (sum, { index, sides }) => sum + (turnsToMatch(board.tiles[index], sides) ?? 0),
    0,
  );
  return { ...board, par };
};
