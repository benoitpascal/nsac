import type { ExcavatorCue } from '../radio/base-radio-lines';

/** Where the robot mission stands, for the base to know when to speak up. */
export type CueProgress = {
  carriedKg: number;
  deliveredKg: number;
  goalKg: number;
  /** Whether the robot's drums are emptying right now. */
  unloading: boolean;
};

/**
 * Returns the cue the base should say now, if any, given the cues already said: « enough
 * regolith » once the robot has dug enough to reach the goal, then « unloaded » once the goal is
 * dropped off and the drums have stopped unloading. Each cue is said once.
 */
export const nextExcavatorCue = (
  said: ReadonlySet<ExcavatorCue>,
  progress: CueProgress,
): ExcavatorCue | undefined => {
  const reached = progress.deliveredKg >= progress.goalKg;
  if (reached && !progress.unloading && !said.has('unloaded')) return 'unloaded';
  const dug = progress.carriedKg + progress.deliveredKg >= progress.goalKg;
  if (dug && !reached && !said.has('enoughRegolith')) return 'enoughRegolith';
  return undefined;
};
