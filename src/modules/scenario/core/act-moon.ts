import {
  DAY_ONE_OPENING,
  EXCAVATOR_ACADEMY,
  EXCAVATOR_BRIEFING,
  MOON_ENDING,
  PRINTER_ACADEMY,
  PRINTER_BRIEFING,
} from './moon-texts';
import type { Act } from './scenario-content';

/** Act II on the Moon: the days, their missions and what the mascot says. */
export const MOON_ACT: Act = {
  id: 'moon',
  days: [
    {
      title: 'Day one',
      opening: DAY_ONE_OPENING,
      missions: [
        {
          id: 'excavator',
          title: 'Dig regolith',
          goal: 'Bring back 50 kg of regolith with the digging robot.',
          briefing: EXCAVATOR_BRIEFING,
          academy: EXCAVATOR_ACADEMY,
          preparation: false,
          game: { kind: 'walk' },
          scoring: 'excavator',
        },
        {
          id: 'printer',
          title: 'Tune the 3D printer',
          goal: 'Aim the printer laser with the mirrors.',
          briefing: PRINTER_BRIEFING,
          academy: PRINTER_ACADEMY,
          preparation: false,
          game: { kind: 'minigame', id: 'laser-mirrors' },
          scoring: 'printer',
        },
      ],
    },
    { title: 'Day two', opening: [], missions: [] },
  ],
  ending: MOON_ENDING,
};
