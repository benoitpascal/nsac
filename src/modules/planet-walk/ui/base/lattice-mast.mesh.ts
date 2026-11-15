import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { createBeacon } from './beacon';

/** A thin lattice tower (m): its height, the width of its square section, its bracing step. */
const MAST = { width: 0.35, rod: 0.025, brace: 0.9 };
const STEEL = 0xb8bec9;

/**
 * Builds a lattice antenna mast of the given height (m): four rods braced every step, a small
 * equipment box and whip antennas near the top, and a flashing orange beacon on its tip.
 */
export const createLatticeMast = (height: number) => {
  const steel = new MeshStandardMaterial({ color: STEEL, metalness: 0.6, roughness: 0.4 });
  const mast = new Group();
  const half = MAST.width / 2;
  for (const [x, z] of [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ]) {
    const rod = new Mesh(new CylinderGeometry(MAST.rod, MAST.rod, height, 5), steel);
    rod.position.set(x, height / 2, z);
    mast.add(rod);
  }
  for (let y = MAST.brace; y < height; y += MAST.brace) {
    for (const turn of [0, Math.PI / 2]) {
      const ring = new Group();
      for (const side of [-1, 1]) {
        const bar = new Mesh(new BoxGeometry(MAST.width, MAST.rod, MAST.rod), steel);
        bar.position.z = side * half;
        ring.add(bar);
      }
      ring.rotation.y = turn;
      ring.position.y = y;
      mast.add(ring);
    }
  }
  const box = new Mesh(new BoxGeometry(0.4, 0.5, 0.3), steel);
  box.position.set(0.3, height * 0.75, 0);
  const whip = new Mesh(new CylinderGeometry(0.012, 0.012, 1.2, 4), steel);
  whip.position.set(-0.2, height + 0.5, 0);
  const beacon = createBeacon();
  beacon.position.y = height + 0.15;
  mast.add(box, whip, beacon);
  mast.traverse((part) => {
    part.castShadow = true;
  });
  return mast;
};
