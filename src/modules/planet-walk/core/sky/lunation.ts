/** A known new Moon: 6 January 2000, 18:14 UTC. */
export const NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);
/** One synodic month, from new Moon to new Moon (h). */
export const SYNODIC_HOURS = 708.734;
const MS_PER_HOUR = 3_600_000;

/** Returns how far the Moon is into its cycle of phases at that time (0 new Moon, 0.5 full Moon). */
export const lunation = (timestamp: number): number => {
  const cycles = (timestamp - NEW_MOON_MS) / (SYNODIC_HOURS * MS_PER_HOUR);
  return cycles - Math.floor(cycles);
};
