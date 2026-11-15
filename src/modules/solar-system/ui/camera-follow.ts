import { Vector3 } from 'three';
import { createOrbitTurn } from './orbit-turn';
import type { PerspectiveCamera, Object3D } from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type CameraFollow = {
  /**
   * Flies to the object, ending at the given distance, and lets the user zoom down to the minimum,
   * bringing the near clipping plane closer for small bodies. Given a center the object goes
   * around, the camera ends on the outer side and turns around that center with the object.
   */
  flyTo: (object: Object3D, viewDistance: number, minDistance: number, center?: Object3D) => void;
  /** Sets how far the user can zoom out. */
  setMaxDistance: (maxDistance: number) => void;
  /** Moves the camera along the flight, then keeps it following the object as it orbits. */
  update: (elapsedSeconds: number) => void;
};

const FLIGHT_SECONDS = 1.5;
const NEAR_PLANE_IN_MIN_DISTANCES = 0.2;

const easeInOut = (progress: number) => progress * progress * (3 - 2 * progress);

/**
 * Lets the camera fly to a body and follow it, while the user keeps spinning and zooming around
 * it. The flight is instant when the user prefers reduced motion.
 */
export const createCameraFollow = (
  camera: PerspectiveCamera,
  controls: OrbitControls,
  reducedMotion: boolean,
): CameraFollow => {
  const widestNearPlane = camera.near;
  let followed: Object3D | undefined;
  const orbitTurn = createOrbitTurn();
  let viewDistance = 0;
  let progress = 1;
  const startTarget = new Vector3();
  const startOffset = new Vector3();
  const endOffset = new Vector3();
  const anchor = new Vector3();
  const offset = new Vector3();

  const fly = (elapsedSeconds: number) => {
    progress = reducedMotion ? 1 : Math.min(progress + elapsedSeconds / FLIGHT_SECONDS, 1);
    const outward = orbitTurn.outward(anchor);
    if (outward) endOffset.copy(outward).multiplyScalar(viewDistance);
    const eased = easeInOut(progress);
    controls.target.lerpVectors(startTarget, anchor, eased);
    offset.lerpVectors(startOffset, endOffset, eased);
    camera.position.copy(controls.target).add(offset);
  };

  const follow = () => {
    camera.position.add(offset.subVectors(anchor, controls.target));
    controls.target.copy(anchor);
    orbitTurn.turnCamera(anchor, camera.position);
  };

  return {
    setMaxDistance: (maxDistance) => {
      controls.maxDistance = maxDistance;
    },
    flyTo: (object, distance, minDistance, orbitCenter) => {
      followed = object;
      orbitTurn.aroundCenter(orbitCenter);
      viewDistance = distance;
      progress = reducedMotion ? 1 - Number.EPSILON : 0;
      startTarget.copy(controls.target);
      startOffset.copy(camera.position).sub(controls.target);
      endOffset.copy(startOffset).setLength(distance);
      controls.minDistance = minDistance;
      camera.near = Math.min(widestNearPlane, minDistance * NEAR_PLANE_IN_MIN_DISTANCES);
      camera.updateProjectionMatrix();
    },
    update: (elapsedSeconds) => {
      if (!followed) return;
      followed.getWorldPosition(anchor);
      if (progress < 1) fly(elapsedSeconds);
      else follow();
    },
  };
};
