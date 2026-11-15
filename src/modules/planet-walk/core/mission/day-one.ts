/** What the walk reports to the day's mission: regolith in the robot's drums and back at the base. */
export type MissionInputs = {
  carriedKg: number;
  deliveredKg: number;
  robotCharged: boolean;
};

/** The day's goals, in the order the briefing gives them: collect, then bring back. */
export type ObjectiveId = 'collect' | 'return';

/** A goal of the day, done or not, with how far along it is (units of regolith). */
export type Objective = {
  id: ObjectiveId;
  done: boolean;
  progress: { value: number; target: number };
};

/** Where the day stands: still going, regolith brought home, or the robot stuck without power. */
export type MissionOutcome = 'playing' | 'won' | 'stranded';

/** One unit of regolith (kg), and the units the base needs on day one (gameplay, see DATA.md). */
export const DAY_ONE = { kgPerUnit: 10, goalUnits: 5 };

const units = (kg: number) => Math.min(Math.floor(kg / DAY_ONE.kgPerUnit), DAY_ONE.goalUnits);

/** Returns the day's goals: regolith dug so far, and regolith brought back to the base. */
export const dayOneObjectives = (inputs: MissionInputs): Objective[] => {
  const collected = units(inputs.carriedKg + inputs.deliveredKg);
  const returned = units(inputs.deliveredKg);
  return [
    {
      id: 'collect',
      done: collected >= DAY_ONE.goalUnits,
      progress: { value: collected, target: DAY_ONE.goalUnits },
    },
    {
      id: 'return',
      done: returned >= DAY_ONE.goalUnits,
      progress: { value: returned, target: DAY_ONE.goalUnits },
    },
  ];
};

/**
 * Returns where the day stands: won once enough regolith is back at the base; stranded when the
 * robot's battery is empty before that, since nothing can recharge it out there.
 */
export const dayOneOutcome = (inputs: MissionInputs): MissionOutcome => {
  if (units(inputs.deliveredKg) >= DAY_ONE.goalUnits) return 'won';
  return inputs.robotCharged ? 'playing' : 'stranded';
};
