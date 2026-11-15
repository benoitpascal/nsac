/** What the walk reports to the day's mission: the robot's work, and whether the oxygen was checked. */
export type MissionInputs = {
  deliveredKg: number;
  robotCharged: boolean;
  checkedOxygen: boolean;
};

/** The day's goals, in the order the briefing gives them. */
export type ObjectiveId = 'regolith' | 'oxygen';

/** A goal of the day, done or not, with how far along it is when it counts something. */
export type Objective = {
  id: ObjectiveId;
  done: boolean;
  progress?: { value: number; target: number };
};

/** Where the day stands: still going, every goal met, or the robot out of power before the target. */
export type MissionOutcome = 'playing' | 'won' | 'stranded';

/** Regolith the base needs on day one (kg): a gameplay target, see DATA.md. */
export const DAY_ONE = { regolithTargetKg: 50 };

/** Returns the day's goals and how far each has come. */
export const dayOneObjectives = (inputs: MissionInputs): Objective[] => [
  {
    id: 'regolith',
    done: inputs.deliveredKg >= DAY_ONE.regolithTargetKg,
    progress: {
      value: Math.min(inputs.deliveredKg, DAY_ONE.regolithTargetKg),
      target: DAY_ONE.regolithTargetKg,
    },
  },
  { id: 'oxygen', done: inputs.checkedOxygen },
];

/**
 * Returns where the day stands: won once every goal is met; stranded when the robot's battery is
 * empty before enough regolith reached the base, since nothing can recharge it today.
 */
export const dayOneOutcome = (inputs: MissionInputs): MissionOutcome => {
  if (dayOneObjectives(inputs).every((objective) => objective.done)) return 'won';
  const short = inputs.deliveredKg < DAY_ONE.regolithTargetKg;
  return short && !inputs.robotCharged ? 'stranded' : 'playing';
};
