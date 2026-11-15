import {
  CylinderGeometry,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from 'three';
import type { BufferGeometry } from 'three';

/** A strut's radius, as a share of the dome's radius. */
const STRUT = 0.0067;
const UP = new Vector3(0, 1, 0);

/** One strut along every edge of the glass, drawn together in a single batch. */
export const domeStruts = (glass: BufferGeometry, radius: number) => {
  const points = glass.getAttribute('position');
  const edges = new Map<string, [Vector3, Vector3]>();
  const key = (point: Vector3) =>
    point
      .toArray()
      .map((value) => value.toFixed(2))
      .join();
  for (let index = 0; index < points.count; index += 3) {
    const corners = [0, 1, 2].map((corner) =>
      new Vector3().fromBufferAttribute(points, index + corner),
    );
    for (const [from, to] of [
      [0, 1],
      [1, 2],
      [2, 0],
    ]) {
      const [a, b] = [corners[from], corners[to]];
      edges.set([key(a), key(b)].sort().join('|'), [a, b]);
    }
  }
  const bars = new InstancedMesh(
    new CylinderGeometry(STRUT * radius, STRUT * radius, 1, 5),
    new MeshStandardMaterial({ color: 0xd8dbe0, metalness: 0.6, roughness: 0.35 }),
    edges.size,
  );
  [...edges.values()].forEach(([a, b], index) => {
    const turn = new Quaternion().setFromUnitVectors(UP, b.clone().sub(a).normalize());
    const middle = a.clone().add(b).multiplyScalar(0.5);
    bars.setMatrixAt(
      index,
      new Matrix4().compose(middle, turn, new Vector3(1, a.distanceTo(b), 1)),
    );
  });
  bars.castShadow = true;
  return bars;
};
