/**
 * Multiples of the mean elongation, Sun mean anomaly, Moon mean anomaly and argument of
 * latitude, followed by the term amplitude.
 */
export type LunarTerm = [number, number, number, number, number];

/** Main periodic terms in longitude (degrees), from J. Meeus, Astronomical Algorithms, 47.A. */
export const LONGITUDE_TERMS: LunarTerm[] = [
  [0, 0, 1, 0, 6.288774],
  [2, 0, -1, 0, 1.274027],
  [2, 0, 0, 0, 0.658314],
  [0, 0, 2, 0, 0.213618],
  [0, 1, 0, 0, -0.185116],
  [0, 0, 0, 2, -0.114332],
  [2, 0, -2, 0, 0.058793],
  [2, -1, -1, 0, 0.057066],
  [2, 0, 1, 0, 0.053322],
  [2, -1, 0, 0, 0.045758],
  [0, 1, -1, 0, -0.040923],
  [1, 0, 0, 0, -0.03472],
  [0, 1, 1, 0, -0.030383],
];

/** Main periodic terms in distance (km, cosine terms), from J. Meeus, 47.A. */
export const DISTANCE_TERMS: LunarTerm[] = [
  [0, 0, 1, 0, -20905.355],
  [2, 0, -1, 0, -3699.111],
  [2, 0, 0, 0, -2955.968],
  [0, 0, 2, 0, -569.925],
  [0, 1, 0, 0, 48.888],
  [2, 0, -2, 0, 246.158],
  [2, -1, -1, 0, -152.138],
  [2, 0, 1, 0, -170.733],
  [2, -1, 0, 0, -204.586],
  [0, 1, -1, 0, -129.62],
  [1, 0, 0, 0, 108.743],
  [0, 1, 1, 0, 104.755],
];

/** Main periodic terms in latitude (degrees), from J. Meeus, Astronomical Algorithms, 47.B. */
export const LATITUDE_TERMS: LunarTerm[] = [
  [0, 0, 0, 1, 5.128122],
  [0, 0, 1, 1, 0.280602],
  [0, 0, 1, -1, 0.277693],
  [2, 0, 0, -1, 0.173237],
  [2, 0, -1, 1, 0.055413],
  [2, 0, -1, -1, 0.046271],
];
