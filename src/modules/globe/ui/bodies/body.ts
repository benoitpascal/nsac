import { Group } from 'three';
import type { GlobeRotation } from '../../core/globe';
import type { SpinBlurSetter } from './spin-blur';
import type { Object3D, Vector3, WebGLRenderer } from 'three';

export type Body = {
  root: Object3D;
  update: (rotation: GlobeRotation) => void;
  /** Smears the surface over the given fraction of a turn, on bodies that can spin fast. */
  setSpinBlur?: SpinBlurSetter;
};

export type BodyContext = {
  renderer: WebGLRenderer;
  sunDirection: Vector3;
};

export type BodyFactory = (context: BodyContext, axialTilt: number) => Promise<Body>;

/**
 * Wraps an object spinning around an axis tilted by the given angle.
 * Static parts (such as an atmosphere) are added around it without spinning.
 */
export const createSpinningBody = (
  spinning: Object3D,
  axialTilt: number,
  staticParts: Object3D[] = [],
): Body => {
  const axis = new Group();
  axis.add(spinning);
  axis.rotation.z = axialTilt;
  const root = new Group();
  root.add(axis);
  for (const part of staticParts) root.add(part);
  return {
    root,
    update: (rotation) => {
      spinning.rotation.y = rotation.surface;
    },
  };
};
