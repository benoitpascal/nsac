/**
 * Where the walker faces, in degrees clockwise from the game's north (0 to 360).
 *
 * The Moon has no magnetic field, so a real compass would not work there: the HUD's compass is a
 * heading tape, like a pilot's. The game's north is -z, the way the walker faces at the start;
 * this is a game convention, not the Moon's true north (see DATA.md).
 */
export const bearingDegrees = (heading: number): number => {
  const degrees = (-heading * 180) / Math.PI;
  return ((degrees % 360) + 360) % 360;
};

/** The marks of the compass tape, every 45°. */
export const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
