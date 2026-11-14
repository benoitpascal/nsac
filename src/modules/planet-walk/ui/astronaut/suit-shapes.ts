import { CapsuleGeometry, Mesh, SphereGeometry, TorusGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Material } from 'three';

/** A point (m) as [x, y, z]. */
export type Place = [number, number, number];

const at = (mesh: Mesh, place: Place) => {
  mesh.position.set(...place);
  mesh.castShadow = true;
  return mesh;
};

/** A rounded segment along y (limb, finger), centered at the place. */
export const capsule = (radius: number, length: number, place: Place, material: Material) =>
  at(new Mesh(new CapsuleGeometry(radius, length, 8, 16), material), place);

/** A box with rounded edges (backpack, boot, glove, chest unit). */
export const roundedBox = (size: Place, rounding: number, place: Place, material: Material) =>
  at(new Mesh(new RoundedBoxGeometry(...size, 3, rounding), material), place);

/** A ball (shoulder joint, button). */
export const sphere = (radius: number, place: Place, material: Material) =>
  at(new Mesh(new SphereGeometry(radius, 24, 16), material), place);

/** A ring around a vertical limb (suit bearing at a joint, stripe band). */
export const ring = (radius: number, tube: number, place: Place, material: Material) => {
  const mesh = at(new Mesh(new TorusGeometry(radius, tube, 8, 32), material), place);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
};
