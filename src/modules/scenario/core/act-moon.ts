import {
  DAY_ONE_OPENING,
  DAY_TWO_OPENING,
  EXCAVATOR_ACADEMY,
  EXCAVATOR_BRIEFING,
  MOON_ENDING,
  PRINTER_ACADEMY,
  PRINTER_BRIEFING,
  SHELTER_ACADEMY,
  SHELTER_BRIEFING,
} from './moon-texts';
import type { Act } from './scenario-content';

/** Act II on the Moon: the days, their missions and what the mascot says. */
export const MOON_ACT: Act = {
  id: 'moon',
  days: [
    {
      title: 'Day one',
      opening: DAY_ONE_OPENING,
      closing: 'printer',
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
    {
      title: 'Day two',
      opening: DAY_TWO_OPENING,
      planning: true,
      closing: 'night',
      missions: [
        {
          id: 'shelter',
          title: 'Build the shelter',
          goal: 'Lift the bricks into place with the crane, keeping its arm level.',
          briefing: SHELTER_BRIEFING,
          academy: SHELTER_ACADEMY,
          preparation: false,
          game: { kind: 'minigame', id: 'precision-balance' },
          scoring: 'shelter',
        },
      ],
    },
    { title: 'Day three', opening: [], closing: 'night', missions: [] },
  ],
  ending: MOON_ENDING,
};
