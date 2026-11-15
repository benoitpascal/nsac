import { Vector3 } from 'three';

const UP = new Vector3(0, 1, 0);
const SIDEWAYS = new Vector3(1, 0, 0);

/**
 * Returns the spot moved to the nearest whole shadow-map pixel, as seen from the Sun: the shadows
 * then jump from pixel to pixel as the walker moves, instead of shimmering on every step.
 */
export const snapToShadowPixels = (spot: Vector3, toSun: Vector3, pixelM: number) => {
  const forward = toSun.clone().negate().normalize();
  const right = new Vector3().crossVectors(Math.abs(forward.y) > 0.99 ? SIDEWAYS : UP, forward);
  right.normalize();
  const up = new Vector3().crossVectors(forward, right);
  const snap = (axis: Vector3) => Math.round(spot.dot(axis) / pixelM) * pixelM;
  return forward
    .clone()
    .multiplyScalar(spot.dot(forward))
    .addScaledVector(right, snap(right))
    .addScaledVector(up, snap(up));
};
