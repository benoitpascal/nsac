/** One line of the « today's goal » checklist. */
export type Goal = { label: string; done: boolean };

/** What the excavator mission has reached so far. */
export type ExcavatorProgress = {
  /** Whether the robot has reached the dig zone at least once. */
  reachedDigZone: boolean;
  /** Regolith the robot carries now (kg). */
  carriedKg: number;
  /** Regolith dropped off at the base (kg). */
  deliveredKg: number;
  goalKg: number;
};

/**
 * The three steps of the excavator mission, as the design team wrote them (go to the dig site,
 * dig the regolith, bring it back to the base), done with the robot driven from the station.
 */
export const excavatorGoals = (progress: ExcavatorProgress): Goal[] => {
  const delivered = Math.min(Math.floor(progress.deliveredKg), progress.goalKg);
  return [
    { label: 'Drive the robot to the yellow zone', done: progress.reachedDigZone },
    {
      label: 'Dig up regolith (Moon dust and rocks)',
      done: progress.carriedKg > 0 || progress.deliveredKg > 0,
    },
    {
      label: `Drop ${progress.goalKg} kg in the red zone (${delivered}/${progress.goalKg})`,
      done: progress.deliveredKg >= progress.goalKg,
    },
  ];
};
