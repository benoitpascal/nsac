import {
  DodecahedronGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from 'three';
import type { Rock } from './rock-layout';

const FLATTENING = 0.6;
const SINKING = 0.3;

/** Draws the rocks in the given color, as one mesh. */
export const createRocks = (color: number, layout: Rock[]) => {
  const material = new MeshStandardMaterial({ color, roughness: 1, flatShading: true });
  const rocks = new InstancedMesh(new DodecahedronGeometry(1, 0), material, layout.length);
  const matrix = new Matrix4();
  layout.forEach(({ x, z, size, tilt, turn }, index) => {
    const rotation = new Quaternion().setFromEuler(new Euler(tilt, turn, 0));
    const position = new Vector3(x, size * SINKING, z);
    rocks.setMatrixAt(
      index,
      matrix.compose(position, rotation, new Vector3(size, size * FLATTENING, size)),
    );
  });
  return rocks;
};
