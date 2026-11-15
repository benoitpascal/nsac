import { describe, expect, it } from 'vitest';
import { randomPath } from '@/modules/minigames/games/pipe-flow/core/path';
import { generateLevel } from '@/modules/minigames/games/pipe-flow/core/level';
import { LEVEL_SIZES } from '@/modules/minigames/games/pipe-flow/core/game';

/** Small seeded random, so failures replay. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

describe('pipe flow, sized for 7-year-olds', () => {
  it('keeps the grids small', () => {
    expect(Math.max(...LEVEL_SIZES)).toBeLessThanOrEqual(4);
  });

  it('lays a route that never goes back left nor turns back on itself', () => {
    for (let seed = 1; seed < 200; seed += 1) {
      const random = seeded(seed);
      const start = { row: Math.floor(random() * 4), column: 0 };
      const end = { row: Math.floor(random() * 4), column: 3 };
      const path = randomPath(start, end, 4, random);
      expect(path[0]).toEqual(start);
      expect(path.at(-1)).toEqual(end);
      expect(path.length).toBe(3 + Math.abs(end.row - start.row) + 1);
      path.slice(1).forEach((cell, step) => {
        expect(cell.column).toBeGreaterThanOrEqual(path[step].column);
      });
    }
  });

  it('only fills the board with empty ground, straights and corners', () => {
    for (let seed = 1; seed < 50; seed += 1) {
      const level = generateLevel(4, seeded(seed));
      expect(level.tiles.every((tile) => !['tee', 'cross'].includes(tile.kind))).toBe(true);
      expect(level.par).toBeGreaterThan(0);
    }
  });
});
