import { describe, expect, it } from 'vitest';
import {
  arrowTurn,
  footprintOnMap,
  progressPercent,
  toMap,
} from '@/modules/planet-walk/core/map/minimap';

const FRAME = { sizePx: 260, rangeM: 65 };

describe('minimap', () => {
  it('keeps the walker in the middle, -z at the top', () => {
    const center = { x: 10, z: -4 };
    expect(toMap(FRAME, center, center)).toEqual({ x: 130, z: 130 });
    expect(toMap(FRAME, center, { x: 10, z: -69 })).toEqual({ x: 130, z: 0 });
    expect(toMap(FRAME, center, { x: 75, z: -4 })).toEqual({ x: 260, z: 130 });
  });

  it('drops what lies wholly outside the map', () => {
    const far = { minX: 100, maxX: 110, minZ: 0, maxZ: 5 };
    expect(footprintOnMap(FRAME, { x: 0, z: 0 }, far)).toBeUndefined();
    const near = { minX: -1, maxX: 1, minZ: -2, maxZ: 2 };
    expect(footprintOnMap(FRAME, { x: 0, z: 0 }, near)).toEqual({
      x: 128,
      y: 126,
      width: 4,
      height: 8,
    });
  });

  it('turns the arrow clockwise when the walker turns right', () => {
    expect(arrowTurn(0)).toBe(-0);
    expect(arrowTurn(-Math.PI / 2)).toBeCloseTo(Math.PI / 2);
  });

  it('rounds the mission share down and keeps it between 0 and 100 %', () => {
    expect(progressPercent(12.9, 50)).toBe(25);
    expect(progressPercent(80, 50)).toBe(100);
    expect(progressPercent(0, 0)).toBe(100);
  });
});
