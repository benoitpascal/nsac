import { BASE_SITE } from '../base/base-layout';

/** The walker stays within this distance (m) of the start, on ground kept perfectly flat. */
export const FLAT_RADIUS_M = 500;
/** Where the hills start rising beyond the flat ground, and how high they get (m). */
const HILLS = { from: 560, fullAt: 1400, height: 90, scale: 700 };
/** Craters drawn on the flat ground by light and shade only, so that the walker never trips. */
const CRATERS = { count: 70, minRadius: 3, maxRadius: 40, depthShare: 0.2, rimShare: 0.06 };
/** Ground kept free of craters around the start and the base (m). */
const START_CLEARING_M = 12;

const randomFrom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

const lattice = (x: number, z: number) => {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43_758.5453;
  return value - Math.floor(value);
};

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Smooth noise in [0, 1) over the ground, one bump per unit. */
const valueNoise = (x: number, z: number) => {
  const [cellX, cellZ] = [Math.floor(x), Math.floor(z)];
  const [u, v] = [smooth(x - cellX), smooth(z - cellZ)];
  const top = lattice(cellX, cellZ) * (1 - u) + lattice(cellX + 1, cellZ) * u;
  const bottom = lattice(cellX, cellZ + 1) * (1 - u) + lattice(cellX + 1, cellZ + 1) * u;
  return top * (1 - v) + bottom * v;
};

/** Noise summed over several sizes, from the given size (m) down to an eighth of it. */
export const layeredNoise = (x: number, z: number, size: number) => {
  let [sum, weight, scale] = [0, 0.5, 1 / size];
  for (let octave = 0; octave < 4; octave++) {
    sum += valueNoise(x * scale, z * scale) * weight;
    weight /= 2;
    scale *= 2.1;
  }
  return sum / 0.9375;
};

type Crater = { x: number; z: number; radius: number };

const scatterCraters = (): Crater[] => {
  const random = randomFrom(7);
  return Array.from({ length: CRATERS.count }, () => {
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * FLAT_RADIUS_M;
    const radius = CRATERS.minRadius + random() ** 3 * (CRATERS.maxRadius - CRATERS.minRadius);
    return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance, radius };
  }).filter(
    ({ x, z, radius }) =>
      Math.hypot(x, z) > START_CLEARING_M + radius &&
      Math.hypot(x - BASE_SITE.x, z - BASE_SITE.z) > BASE_SITE.radius + radius,
  );
};

const craters = scatterCraters();

/** A bowl with a raised rim, as a meteorite leaves it (m, negative inside). */
const craterShape = (distance: number, radius: number) => {
  const ratio = distance / radius;
  const bowl = ratio < 1 ? -(1 - ratio * ratio) * CRATERS.depthShare * radius : 0;
  const rim = Math.exp(-(((ratio - 1) / 0.35) ** 2)) * CRATERS.rimShare * radius;
  return bowl + rim;
};

/** How deep the craters of the flat ground look at that spot (m), for its light and shade only. */
export const craterRelief = (x: number, z: number) => {
  let height = 0;
  for (const crater of craters) {
    const distance = Math.hypot(x - crater.x, z - crater.z);
    if (distance < crater.radius * 2) height += craterShape(distance, crater.radius);
  }
  return height;
};

/** Height (m) of the real ground: flat where one walks, rising into rounded hills beyond. */
export const hillHeight = (x: number, z: number) => {
  const distance = Math.hypot(x, z);
  if (distance <= HILLS.from) return 0;
  const rise = smooth(Math.min((distance - HILLS.from) / (HILLS.fullAt - HILLS.from), 1));
  return rise * HILLS.height * layeredNoise(x + 9000, z - 4000, HILLS.scale) ** 1.6;
};
