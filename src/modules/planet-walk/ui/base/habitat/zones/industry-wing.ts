import { glowing, item, ZONE_COLORS as C } from './zone-plan';
import type { WingPlan } from './zone-plan';

const SOIL = 0x5a4632;
const PLANT = 0x3fae4a;
const GROW_LIGHT = 0xff4dd2;
const AIR_UNIT = 0xc0c6cf;

/** Two rows of planters under pink grow lights, one on each side. */
const planters = [-1, 1].flatMap((side) => [
  item([side * 1.05, 0, 0.7, 4, 0, 0.6], SOIL),
  item([side * 1.05, 0, 0.6, 3.8, 0.6, 1.1], PLANT),
  glowing([side * 1.05, 0, 0.6, 3.8, 2.2, 2.3], GROW_LIGHT),
]);

/** Workshops and supplies: storage near the hall, then the workshops, the life support plant and the greenhouse. */
export const INDUSTRY_WING: WingPlan = {
  name: 'Workshops & supplies · 8 to 12',
  zones: [
    {
      name: '12 · Storage',
      length: 3.5,
      items: [-1, 1].map((side) => item([side * 1.15, 0, 0.6, 2.8, 0, 2.0], C.wood)),
    },
    {
      name: '9 · Electronics & IT',
      length: 3.5,
      items: [
        item([-1.2, -0.6, 0.5, 1.2, 0, 2.0], C.dark),
        glowing([-0.93, -0.6, 0.04, 1.0, 0.4, 1.8], C.screen),
        item([1.1, 0.3, 0.7, 1.6, 0, 0.8], C.bench),
        glowing([1.3, 0.3, 0.1, 1.2, 0.9, 1.4], C.screen),
      ],
    },
    {
      name: '8 · Mechanical workshop',
      length: 4.5,
      items: [
        item([-1.1, 0, 0.7, 2.5, 0, 0.95], C.wood),
        item([-1.42, 0, 0.05, 2.5, 1.1, 2.0], C.orange),
        item([1.0, 0.8, 0.9, 0.9, 0, 0.9], C.dark),
        item([1.1, -1.0, 0.6, 1.0, 0, 1.2], C.metal),
      ],
    },
    {
      name: '11 · Water, air & recycling',
      length: 4,
      items: [
        item([-1.05, -0.8, 0.8, 1.2, 0, 2.0], C.water),
        item([-1.05, 0.9, 0.8, 1.2, 0, 2.0], C.water),
        item([1.1, 0, 0.7, 2, 0, 1.8], AIR_UNIT),
        glowing([0.73, 0, 0.04, 1, 1.0, 1.3], C.green),
      ],
    },
    { name: '10 · Greenhouse', length: 5, items: planters },
  ],
};
