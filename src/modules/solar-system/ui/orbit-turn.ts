import { Quaternion, Vector3 } from 'three';
import type { Object3D } from 'three';

export type OrbitTurn = {
  /** Sets the center the followed object goes around (none to stop turning). */
  aroundCenter: (center: Object3D | undefined) => void;
  /** Returns the direction from the center to the anchor, remembering it; none without center. */
  outward: (anchor: Vector3) => Vector3 | undefined;
  /** Turns the camera around the anchor as much as the anchor turned around the center. */
  turnCamera: (anchor: Vector3, cameraPosition: Vector3) => void;
};

/** Keeps the camera on the same side of an object as the object goes around its center. */
export const createOrbitTurn = (): OrbitTurn => {
  let center: Object3D | undefined;
  const centerPosition = new Vector3();
  const direction = new Vector3();
  const previous = new Vector3();
  const offset = new Vector3();
  const rotation = new Quaternion();
  const measure = (anchor: Vector3) => {
    center?.getWorldPosition(centerPosition);
    return direction.subVectors(anchor, centerPosition).normalize();
  };
  return {
    aroundCenter: (next) => {
      center = next;
    },
    outward: (anchor) => {
      if (!center) return undefined;
      previous.copy(measure(anchor));
      return previous;
    },
    turnCamera: (anchor, cameraPosition) => {
      if (!center) return;
      rotation.setFromUnitVectors(previous, measure(anchor));
      previous.copy(direction);
      offset.subVectors(cameraPosition, anchor).applyQuaternion(rotation);
      cameraPosition.copy(anchor).add(offset);
    },
  };
};
