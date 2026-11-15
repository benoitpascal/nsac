import {
  EXCAVATOR_ACADEMY,
  EXCAVATOR_BRIEFING,
  LASER_ACADEMY,
  LASER_BRIEFING,
  MOON_ENDING,
} from './moon-texts';
import type { Act } from './scenario-content';

/** Act II on the Moon: the days, their missions and what the mascot says. */
export const MOON_ACT: Act = {
  id: 'moon',
  days: [
    {
      title: 'Day one',
      statusCards: [],
      missions: [
        {
          id: 'excavator',
          title: 'Dig regolith',
          goal: 'Bring back 50 kg of regolith with the digging robot.',
          briefing: EXCAVATOR_BRIEFING,
          academy: EXCAVATOR_ACADEMY,
          preparation: true,
          game: { kind: 'walk' },
          scoring: 'excavator',
        },
        {
          id: 'laser-comms',
          title: 'Call Earth',
          goal: "Send today's data to Earth with the laser.",
          briefing: LASER_BRIEFING,
          academy: LASER_ACADEMY,
          preparation: false,
          game: { kind: 'minigame', id: 'laser-mirrors' },
          scoring: 'laser',
        },
      ],
    },
    { title: 'Day two', statusCards: [], missions: [] },
  ],
  ending: MOON_ENDING,
};
