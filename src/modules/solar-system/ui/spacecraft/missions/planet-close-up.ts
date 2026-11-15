import { REAL_RADIUS_KM } from '../../../core/body-radii';
import { heliocentricPosition } from '../../../core/orbit';
import { PLANET_ORBITS } from '../../../core/orbital-elements';
import { toScenePosition } from '../../../core/scene-scale';
import { displayRadius, SCENE_UNITS_PER_KM } from '../../nodes/display-scale';
import type { OrbitingPlanetId } from '../../../core/orbital-elements';
import type { ScenePosition } from '../../../core/scene-scale';

/** Distance (in shown radii) within which a craft is placed relative to the enlarged planet. */
const CLOSE_UP_IN_SHOWN_RADII = 4;
/** Height (in real radii) below which close heights stay nearly proportional. */
const KNEE_IN_REAL_RADII = 10;
const PLANET_IDS = Object.keys(PLANET_ORBITS) as OrbitingPlanetId[];

const closeHeight = (height: number, planet: OrbitingPlanetId) => {
  const realRadius = REAL_RADIUS_KM[planet] * SCENE_UNITS_PER_KM;
  const shownRadius = displayRadius(planet, 'easy');
  const reach = shownRadius * CLOSE_UP_IN_SHOWN_RADII;
  const knee = realRadius * KNEE_IN_REAL_RADII;
  const stretch = (value: number) => Math.log1p(Math.max(value - realRadius, 0) / knee);
  return shownRadius + (reach - shownRadius) * (stretch(height) / stretch(reach));
};

/**
 * Easy view: moves a craft passing close to a planet (true scene position) away from the
 * enlarged planet, keeping its direction, so that it flies around the planet rather than
 * through it. Farther than four shown radii, the position stays to scale.
 */
export const placeNearPlanets = (scene: ScenePosition, timestamp: number): ScenePosition => {
  for (const planet of PLANET_IDS) {
    const center = toScenePosition(heliocentricPosition(PLANET_ORBITS[planet], timestamp));
    const offset = { x: scene.x - center.x, y: scene.y - center.y, z: scene.z - center.z };
    const distance = Math.hypot(offset.x, offset.y, offset.z);
    if (distance === 0 || distance >= displayRadius(planet, 'easy') * CLOSE_UP_IN_SHOWN_RADII)
      continue;
    const scale = closeHeight(distance, planet) / distance;
    return {
      x: center.x + offset.x * scale,
      y: center.y + offset.y * scale,
      z: center.z + offset.z * scale,
    };
  }
  return scene;
};
