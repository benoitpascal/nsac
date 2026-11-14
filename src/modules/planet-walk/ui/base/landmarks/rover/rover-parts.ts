import { BoxGeometry, CylinderGeometry, Mesh, MeshStandardMaterial } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Material } from 'three';

/** A size or a place (m) as [x, y, z]. */
export type Triple = [number, number, number];

/** Cabin (m): width, height, the bottom's height, back end, where the windscreen starts. */
export const CABIN = {
  width: 2.7,
  height: 2.3,
  bottom: 1.0,
  back: -2.7,
  windscreen: 1.9,
  nose: 2.7,
};
/** Height of the lower nose under the windscreen (m). */
export const NOSE_HEIGHT = 1.1;

/** The rover's surfaces. */
export const ROVER_MATERIALS = {
  white: new MeshStandardMaterial({ color: 0xeeeeea, roughness: 0.45 }),
  dark: new MeshStandardMaterial({ color: 0x2a2e36, roughness: 0.85 }),
  metal: new MeshStandardMaterial({ color: 0x9aa1ad, metalness: 0.7, roughness: 0.35 }),
  glass: new MeshStandardMaterial({ color: 0x18202e, metalness: 0.6, roughness: 0.15 }),
  stripe: new MeshStandardMaterial({ color: 0xff6b3d, roughness: 0.6 }),
  panel: new MeshStandardMaterial({ color: 0x1d3c7a, metalness: 0.5, roughness: 0.3 }),
  light: new MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xfff4d6, emissiveIntensity: 1.6 }),
};

const placed = (mesh: Mesh, place: Triple) => {
  mesh.position.set(...place);
  mesh.castShadow = true;
  return mesh;
};

/** A plain box. */
export const box = (size: Triple, place: Triple, material: Material) =>
  placed(new Mesh(new BoxGeometry(...size), material), place);

/** A box with rounded edges. */
export const softBox = (size: Triple, rounding: number, place: Triple, material: Material) =>
  placed(new Mesh(new RoundedBoxGeometry(...size, 3, rounding), material), place);

/** A cylinder lying along x (wheel, hub, axle). */
export const sideCylinder = (radius: number, length: number, place: Triple, material: Material) => {
  const mesh = placed(new Mesh(new CylinderGeometry(radius, radius, length, 28), material), place);
  mesh.rotation.z = Math.PI / 2;
  return mesh;
};
