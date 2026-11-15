import { glowing, item, ZONE_COLORS as C } from './zone-plan';
import type { WingPlan } from './zone-plan';

const RED_CROSS = 0xd33a3a;
const ROCK = 0x7a7468;
const GLOVEBOX = 0x9fc4d8;
const CULTURE_GLOW = 0x7dff9a;

/** Science and medicine: the infirmary close to the hall, then the science and biology labs. */
export const SCIENCE_WING: WingPlan = {
  name: 'Science & medical · 5 to 7',
  zones: [
    {
      name: '6 · Infirmary',
      length: 3.5,
      items: [
        item([-1.0, 0, 0.8, 1.9, 0, 0.7], C.white),
        item([1.3, -0.8, 0.3, 1.0, 0, 1.9], C.white),
        item([1.14, -0.8, 0.02, 0.3, 1.2, 1.5], RED_CROSS),
        glowing([1.3, 0.8, 0.3, 0.6, 0.9, 1.5], C.green),
      ],
    },
    {
      name: '5 · Science lab',
      length: 4.5,
      items: [
        item([-1.1, 0, 0.7, 3, 0, 0.9], C.bench),
        item([-1.1, -0.8, 0.3, 0.3, 0.9, 1.1], ROCK),
        item([-1.1, 0.6, 0.2, 0.2, 0.9, 1.3], C.dark),
        item([1.1, 0, 0.7, 1.2, 0, 1.6], GLOVEBOX),
      ],
    },
    {
      name: '7 · Biology lab',
      length: 4,
      items: [
        item([1.1, 0, 0.7, 2.5, 0, 0.9], C.bench),
        item([-1.15, -0.8, 0.6, 0.8, 0, 1.5], C.white),
        glowing([-1.15, 0.9, 0.6, 1.0, 0.2, 1.8], CULTURE_GLOW),
      ],
    },
  ],
};
