import { REAL_RADIUS_KM } from '../../core/body-radii';
import { KM_PER_AU } from '../../core/orbit';
import { SCENE_UNITS_PER_AU } from '../../core/scene-scale';
import type { SizedBodyId } from '../../core/body-radii';

/**
 * Easy view (enlarged bodies) or real scale (real sizes). Planets always stay on their real,
 * to-scale orbits.
 */
export type ScaleMode = 'easy' | 'real';

/** Scale the page opens with. */
export const INITIAL_SCALE_MODE: ScaleMode = 'easy';

/** Camera distance, closest and farthest zoom when viewing the whole solar system. */
export const OVERVIEW: Record<
  ScaleMode,
  { distance: number; minDistance: number; maxDistance: number }
> = {
  easy: { distance: 420, minDistance: 6, maxDistance: 900 },
  real: { distance: 420, minDistance: 0.5, maxDistance: 900 },
};

/** Easy-view radii in scene units, enlarged so that every body stays visible. */
const EASY_RADIUS: Record<SizedBodyId, number> = {
  sun: 1.43,
  mercury: 0.22,
  venus: 0.3,
  earth: 0.32,
  moon: 0.1,
  mars: 0.27,
  jupiter: 1,
  saturn: 0.91,
  uranus: 0.6,
  neptune: 0.58,
};

/** Scene units for one kilometre. */
export const SCENE_UNITS_PER_KM = SCENE_UNITS_PER_AU / KM_PER_AU;

/** Sphere radius of a body model at a root scale of 1, when the model is not a unit sphere. */
const MODEL_SPHERE_RADIUS: Partial<Record<SizedBodyId, number>> = {
  saturn: 0.48,
};

/** Returns the radius (scene units) a body is shown with at the given scale. */
export const displayRadius = (id: SizedBodyId, mode: ScaleMode): number =>
  mode === 'easy' ? EASY_RADIUS[id] : REAL_RADIUS_KM[id] * SCENE_UNITS_PER_KM;

/** Returns the root scale giving the body model the wanted sphere radius. */
export const modelScaleFor = (id: SizedBodyId, radius: number): number =>
  radius / (MODEL_SPHERE_RADIUS[id] ?? 1);
