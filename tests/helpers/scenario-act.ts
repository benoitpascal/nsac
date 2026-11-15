import type { Act, Mission } from '@/modules/scenario/core/scenario-content';

/** A mission played after packing a bag, for missions where the astronaut goes outside. */
export const missionWithBag: Mission = {
  id: 'excavator',
  title: 'Dig regolith',
  goal: 'Bring back 50 kg of regolith.',
  briefing: [],
  academy: [],
  preparation: true,
  game: { kind: 'walk' },
  scoring: 'excavator',
};

/** A mission played straight away, like the printer calibration. */
export const missionWithoutBag: Mission = {
  ...missionWithBag,
  id: 'printer',
  preparation: false,
  game: { kind: 'minigame', id: 'laser-mirrors' },
  scoring: 'printer',
};

/** One day of two missions played in the order the player picks, then a second day with none. */
export const twoMissionAct: Act = {
  id: 'moon',
  days: [
    {
      title: 'Day one',
      opening: [],
      missions: [missionWithBag, missionWithoutBag],
    },
    { title: 'Day two', opening: [], missions: [] },
  ],
  ending: [],
};
