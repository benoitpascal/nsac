import type { Act, Mission } from '@/modules/scenario/core/scenario-content';

/** A mission played after packing a bag, like the excavator one. */
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

/** A mission played straight away, like the laser one. */
export const missionWithoutBag: Mission = {
  ...missionWithBag,
  id: 'laser-comms',
  preparation: false,
  game: { kind: 'minigame', id: 'laser-mirrors' },
  scoring: 'laser',
};

/** One day of two missions, then a second day with none. */
export const twoMissionAct: Act = {
  id: 'moon',
  days: [
    { title: 'Day one', statusCards: [], missions: [missionWithBag, missionWithoutBag] },
    { title: 'Day two', statusCards: [], missions: [] },
  ],
  ending: [],
};
