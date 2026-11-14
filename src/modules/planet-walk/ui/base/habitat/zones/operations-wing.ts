import { item, ZONE_COLORS as C } from './zone-plan';
import type { WingPlan } from './zone-plan';

const HELMET = 0xd4a53c;
const HANDRAIL = 0xffcc33;

/** Two spacesuits standing ready on the left wall. */
const suits = [-0.7, 0.7].flatMap((z) => [
  item([-1.1, z, 0.6, 0.5, 0, 1.75], C.white),
  item([-1.1, z, 0.4, 0.4, 1.75, 2.1], HELMET),
]);

/**
 * Airlock and shelter: the storm shelter walled with water close to the hall, the suit room, and the
 * airlock between two closed doors, the only way in and out of the base.
 */
export const OPERATIONS_WING: WingPlan = {
  name: 'Airlock & shelter · 14 to 16',
  zones: [
    {
      name: '16 · Storm shelter',
      length: 4,
      items: [-1, 1].map((side) => item([side * 1.15, 0, 0.6, 3.6, 0, 2.2], C.water)),
    },
    {
      name: '15 · Suit room',
      length: 3.5,
      items: [...suits, item([1.2, 0, 0.5, 2.4, 0, 2.0], C.metal)],
    },
    {
      name: '14 · Airlock',
      length: 3.4,
      items: [-1, 1].map((side) => item([side * 1.35, 0, 0.1, 2.4, 1.0, 1.05], HANDRAIL)),
      entryDoor: { outward: 'Enter the airlock', inward: 'Enter the suit room' },
    },
  ],
  outerDoor: { outward: 'Go outside', inward: 'Enter the airlock' },
};
