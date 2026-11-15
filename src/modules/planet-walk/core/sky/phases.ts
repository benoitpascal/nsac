/** The name of a phase, as people say it. */
export type PhaseName =
  | 'new'
  | 'waxing crescent'
  | 'first quarter'
  | 'waxing gibbous'
  | 'full'
  | 'waning gibbous'
  | 'last quarter'
  | 'waning crescent';

/** Where each phase ends in the cycle (0 new, 0.5 full), the last one wrapping back to new. */
const PHASES: readonly [number, PhaseName][] = [
  [0.03, 'new'],
  [0.22, 'waxing crescent'],
  [0.28, 'first quarter'],
  [0.47, 'waxing gibbous'],
  [0.53, 'full'],
  [0.72, 'waning gibbous'],
  [0.78, 'last quarter'],
  [0.97, 'waning crescent'],
  [1, 'new'],
];

/** Returns the phase at that point of its cycle (0 new, 0.5 full). */
export const phaseName = (cycle: number): PhaseName => {
  const share = cycle - Math.floor(cycle);
  return (PHASES.find(([end]) => share < end) ?? PHASES[0])[1];
};

/**
 * Returns the phase of the Moon seen from the Earth and of the Earth seen from the Moon at that
 * point of the base's local day (0 at midnight, which falls at new Moon): they are always
 * opposite, so when the Earth sees a thin crescent Moon, the Moon sees an almost full Earth.
 */
export const moonAndEarthPhases = (dayShare: number) => ({
  moon: phaseName(dayShare),
  earth: phaseName(dayShare + 0.5),
});
