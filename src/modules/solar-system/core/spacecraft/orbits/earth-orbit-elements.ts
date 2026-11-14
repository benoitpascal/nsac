/** Orbit around the Earth at a reference date (epoch), angles in degrees. */
export type EarthOrbitElements = {
  epoch: number;
  semiMajorAxisKm: number;
  eccentricity: number;
  inclinationDegrees: number;
  ascendingNodeDegrees: number;
  periapsisArgumentDegrees: number;
  meanAnomalyDegrees: number;
};
