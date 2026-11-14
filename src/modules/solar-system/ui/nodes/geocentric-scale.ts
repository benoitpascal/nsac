import { EARTH_RADIUS_KM } from '../../core/moon-orbit';
import { toSceneOffset } from '../../core/scene-scale';
import { displayRadius, SCENE_UNITS_PER_KM } from './display-scale';
import type { ScaleMode } from './display-scale';
import type { EclipticPosition } from '../../core/orbit';
import type { ScenePosition } from '../../core/scene-scale';

/**
 * Easy-view Moon distance (scene units): the real one would put the Moon inside the enlarged
 * Earth. Its orbit stays far from Venus' and Mars' (1.78 units at least).
 */
const EASY_MOON_DISTANCE = 0.5;
const MEAN_MOON_DISTANCE_KM = 384_400;
/** Altitude (km) below which easy-view altitudes stay nearly proportional. */
const EASY_ALTITUDE_KNEE_KM = 500;

const easyStretch = (altitudeKm: number) =>
  Math.log1p(Math.max(altitudeKm, 0) / EASY_ALTITUDE_KNEE_KM);

/**
 * Returns the shown distance (scene units) from the Earth's center of something the given
 * distance (km) away. Real scale keeps it to scale; easy view squeezes altitudes so that
 * low orbits hug the enlarged Earth and the Moon's mean distance lands on 0.5, in order.
 */
export const geocentricDisplayDistance = (distanceKm: number, mode: ScaleMode): number => {
  if (mode === 'real') return distanceKm * SCENE_UNITS_PER_KM;
  const earth = displayRadius('earth', 'easy');
  const progress =
    easyStretch(distanceKm - EARTH_RADIUS_KM) /
    easyStretch(MEAN_MOON_DISTANCE_KM - EARTH_RADIUS_KM);
  return earth + (EASY_MOON_DISTANCE - earth) * progress;
};

/** Places something relative to the Earth, from its geocentric ecliptic position in km. */
export const geocentricSceneOffset = (
  positionKm: EclipticPosition,
  mode: ScaleMode,
): ScenePosition =>
  toSceneOffset(
    positionKm,
    geocentricDisplayDistance(Math.hypot(positionKm.x, positionKm.y, positionKm.z), mode),
  );

/** Places the Moon relative to the Earth, from its geocentric position in Earth radii. */
export const moonSceneOffset = (position: EclipticPosition, mode: ScaleMode): ScenePosition =>
  geocentricSceneOffset(
    {
      x: position.x * EARTH_RADIUS_KM,
      y: position.y * EARTH_RADIUS_KM,
      z: position.z * EARTH_RADIUS_KM,
    },
    mode,
  );

/** Radius of the Moon's orbit circle drawn around the Earth at the given scale. */
export const moonOrbitRadius = (mode: ScaleMode): number =>
  geocentricDisplayDistance(MEAN_MOON_DISTANCE_KM, mode);
