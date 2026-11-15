import { describe, expect, it } from 'vitest';
import { footprintOnMap, toMap } from '@/modules/planet-walk/core/hud/minimap';

const FRAME = { sizePx: 260, rangeM: 65 };
const close = (point: { x: number; y: number }, x: number, y: number) => {
  expect(point.x).toBeCloseTo(x);
  expect(point.y).toBeCloseTo(y);
};

describe('minimap', () => {
  it('keeps the walker in the middle and what lies ahead at the top', () => {
    const start = { x: 10, z: -4, heading: 0 };
    close(toMap(FRAME, start, start), 130, 130);
    close(toMap(FRAME, start, { x: 10, z: -14 }), 130, 110);
    // Turned left (heading +90°): ahead is -x, which must now point up.
    const left = { x: 0, z: 0, heading: Math.PI / 2 };
    close(toMap(FRAME, left, { x: -10, z: 0 }), 130, 110);
    close(toMap(FRAME, left, { x: 0, z: -10 }), 150, 130);
  });

  it('drops what lies wholly outside the map', () => {
    const center = { x: 0, z: 0, heading: 0 };
    expect(
      footprintOnMap(FRAME, center, { minX: 100, maxX: 110, minZ: 0, maxZ: 5 }),
    ).toBeUndefined();
    expect(footprintOnMap(FRAME, center, { minX: -1, maxX: 1, minZ: -2, maxZ: 2 })).toHaveLength(4);
  });
});
