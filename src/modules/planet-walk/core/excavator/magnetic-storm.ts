import { NORMAL_CONTROLS, scrambleControls } from './control-scramble';
import type { ControlMap } from './control-scramble';

/** Storm state: not come yet, raging with scrambled keys, or over for good. */
export type MagneticStorm = {
  phase: 'calm' | 'raging' | 'over';
  secondsLeft: number;
  sinceScramble: number;
  controls: ControlMap;
};

/** When the storm breaks (kg of regolith on board), how long it lasts, how often keys change (s). */
export const STORM = { triggerLoadKg: 17, durationSeconds: 60, scrambleEverySeconds: 15 };

/** A calm sky: the keys steer as usual. */
export const startStorm = (): MagneticStorm => ({
  phase: 'calm',
  secondsLeft: 0,
  sinceScramble: 0,
  controls: NORMAL_CONTROLS,
});

const breakOut = (random: () => number): MagneticStorm => ({
  phase: 'raging',
  secondsLeft: STORM.durationSeconds,
  sinceScramble: 0,
  controls: scrambleControls(NORMAL_CONTROLS, random),
});

/**
 * Returns the storm after the given time (s): it breaks once, when the robot carries enough
 * regolith, scrambles the Z Q S D keys at once and again every few seconds so that no key keeps
 * its last direction, then ends and gives the keys back.
 */
export const stepStorm = (
  storm: MagneticStorm,
  carriedKg: number,
  seconds: number,
  random: () => number,
): MagneticStorm => {
  if (storm.phase === 'calm') return carriedKg >= STORM.triggerLoadKg ? breakOut(random) : storm;
  if (storm.phase === 'over') return storm;
  const secondsLeft = storm.secondsLeft - seconds;
  if (secondsLeft <= 0)
    return { ...storm, phase: 'over', secondsLeft: 0, controls: NORMAL_CONTROLS };
  const sinceScramble = storm.sinceScramble + seconds;
  if (sinceScramble < STORM.scrambleEverySeconds) return { ...storm, secondsLeft, sinceScramble };
  return {
    ...storm,
    secondsLeft,
    sinceScramble: 0,
    controls: scrambleControls(storm.controls, random),
  };
};
