import { CylinderGeometry, Mesh, Vector3 } from 'three';
import type { Material } from 'three';

const UP = new Vector3(0, 1, 0);

/** A round bar between two points, for legs and braces. */
export const strut = (from: Vector3, to: Vector3, radius: number, material: Material) => {
  const length = from.distanceTo(to);
  const bar = new Mesh(new CylinderGeometry(radius, radius, length, 10), material);
  bar.position.copy(from).add(to).multiplyScalar(0.5);
  bar.quaternion.setFromUnitVectors(UP, to.clone().sub(from).normalize());
  return bar;
};
