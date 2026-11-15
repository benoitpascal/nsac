import { BoxGeometry, CylinderGeometry, Group, Mesh, SphereGeometry } from 'three';
import { createBeacon } from '../../beacon';
import type { MeshStandardMaterial } from 'three';

/** A small thruster block with four nozzles, at a corner of the cabin. */
export const thrusters = (dark: MeshStandardMaterial, metal: MeshStandardMaterial) => {
  const block = new Group();
  block.add(new Mesh(new BoxGeometry(0.3, 0.3, 0.3), metal));
  for (const [x, y, z] of [
    [0.25, 0, 0],
    [0, 0.25, 0],
    [0, -0.25, 0],
    [0, 0, 0.25],
  ]) {
    const nozzle = new Mesh(new CylinderGeometry(0.04, 0.08, 0.2, 10), dark);
    nozzle.position.set(x, y, z);
    if (x) nozzle.rotation.z = -Math.PI / 2;
    if (z) nozzle.rotation.x = Math.PI / 2;
    block.add(nozzle);
  }
  return block;
};

/** The radio dish on its mast on the roof, a beacon on top. */
export const antenna = (metal: MeshStandardMaterial, height: number) => {
  const mast = new Mesh(new CylinderGeometry(0.04, 0.04, 0.9, 8), metal);
  mast.position.y = height + 0.45;
  const dish = new Mesh(new SphereGeometry(0.4, 20, 8, 0, Math.PI * 2, 0, 0.9), metal);
  dish.position.y = height + 1.2;
  dish.rotation.x = Math.PI;
  const beacon = createBeacon(0.08);
  beacon.position.y = height + 1.0;
  return [mast, dish, beacon];
};
