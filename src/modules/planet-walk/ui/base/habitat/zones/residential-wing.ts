import { glowing, item, ZONE_COLORS as C } from './zone-plan';
import type { WingPlan } from './zone-plan';

const SOFA = 0x4d6fa3;
const CABIN = 0xdfe2e7;
const CABIN_DOOR = 0x4d6fa3;

/** The four crew cabins, two on each side of the corridor, each closed by its door. */
const cabins = [-0.7, 0.7].flatMap((z) =>
  [-1, 1].flatMap((side) => [
    item([side * 1.0, z, 0.9, 1.3, 0, 2.1], CABIN),
    item([side * 0.53, z, 0.04, 0.9, 0.05, 1.9], CABIN_DOOR),
  ]),
);

/** Living quarters: kitchen and mess, lounge, gym, and the crew's own cabins at the quiet end. */
export const RESIDENTIAL_WING: WingPlan = {
  name: 'Living quarters · 1 to 4',
  zones: [
    {
      name: '2 · Kitchen & mess',
      length: 4,
      items: [
        item([-1.1, -0.6, 0.7, 2.4, 0, 0.95], C.bench),
        item([-1.1, 1.2, 0.7, 0.7, 0, 1.9], C.white),
        item([1.0, 0, 0.8, 1.6, 0, 0.75], C.wood),
      ],
    },
    {
      name: '3 · Lounge',
      length: 3.5,
      items: [
        item([-1.05, 0, 0.8, 2, 0, 0.45], SOFA),
        item([-1.35, 0, 0.2, 2, 0.45, 0.95], SOFA),
        glowing([1.4, 0, 0.06, 1.4, 1.0, 1.8], C.screen),
      ],
    },
    {
      name: '4 · Gym',
      length: 3.5,
      items: [
        item([-1.0, -0.6, 0.7, 1.6, 0, 0.25], C.dark),
        item([1.0, 0.6, 0.5, 1.0, 0, 1.0], C.orange),
        item([1.25, -1.0, 0.35, 0.8, 0, 1.6], C.metal),
      ],
    },
    { name: '1 · Crew quarters', length: 3, items: cabins },
  ],
};
