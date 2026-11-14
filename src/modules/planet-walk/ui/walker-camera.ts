import { clearDistance } from '../core/follow-camera';
import type { Obstacle } from '../core/obstacles';
import type { Walker } from '../core/walker';
import type { PerspectiveCamera } from 'three';

/** Through the walker's eyes, or from behind the astronaut. */
export type ViewMode = 'first' | 'third';

const EYE_HEIGHT_M = 1.6;
/** Third-person camera: behind and slightly to the right of the astronaut, looking at its shoulders. */
const FOLLOW = {
  distance: 3.8,
  shoulder: 0.7,
  aimHeight: 1.5,
  elevation: 0.25,
  minElevation: -0.15,
  maxElevation: 1.2,
};

/**
 * Places the camera for the view mode: at the walker's eyes looking where the walker faces and
 * the eyes tilt, or behind and above the astronaut's right shoulder looking past it, the tilt raising or lowering
 * the camera and walls bringing it closer.
 */
export const placeCamera = (
  camera: PerspectiveCamera,
  walker: Walker,
  pitch: number,
  mode: ViewMode,
  obstacles: readonly Obstacle[],
) => {
  if (mode === 'first') {
    camera.position.set(walker.x, walker.height + EYE_HEIGHT_M, walker.z);
    camera.rotation.set(pitch, walker.heading, 0, 'YXZ');
    return;
  }
  const elevation = Math.min(
    Math.max(FOLLOW.elevation - pitch, FOLLOW.minElevation),
    FOLLOW.maxElevation,
  );
  const [sin, cos] = [Math.sin(walker.heading), Math.cos(walker.heading)];
  const target = {
    x: walker.x + cos * FOLLOW.shoulder,
    y: walker.height + FOLLOW.aimHeight,
    z: walker.z - sin * FOLLOW.shoulder,
  };
  const direction = {
    x: sin * Math.cos(elevation),
    y: Math.sin(elevation),
    z: cos * Math.cos(elevation),
  };
  const distance = clearDistance(obstacles, target, direction, FOLLOW.distance);
  camera.position.set(
    target.x + direction.x * distance,
    target.y + direction.y * distance,
    target.z + direction.z * distance,
  );
  camera.lookAt(target.x, target.y, target.z);
};
