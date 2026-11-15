import { Group } from 'three';
import { createBox, createCylinder } from '../satellite.shapes';
import type { SatelliteMaterials } from '../satellite.materials';

const BODY = { x: 0.3, y: 0.9, z: 0.3 };
const RAIL = { size: 0.035, overhang: 0.03 };
const DEPLOYED_PANEL = { x: 0.6, y: BODY.y, z: 0.012 };
const WHIP = { radius: 0.006, length: 0.5, lift: 0.02 };

const createRails = (materials: SatelliteMaterials) => {
  const rails = new Group();
  const railSize = { x: RAIL.size, y: BODY.y + RAIL.overhang * 2, z: RAIL.size };
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const rail = createBox(railSize, materials.metal);
      rail.position.set((x * BODY.x) / 2, 0, (z * BODY.z) / 2);
      rails.add(rail);
    }
  }
  return rails;
};

const createWhipAntennas = (materials: SatelliteMaterials) => {
  const whips = new Group();
  for (const axis of ['x', 'z'] as const) {
    const whip = createCylinder(WHIP.radius, WHIP.length * 2, axis, materials.metal);
    whips.add(whip);
  }
  whips.position.y = BODY.y / 2 + WHIP.lift;
  return whips;
};

/**
 * Assembles a three-unit CubeSat: a small body covered in solar cells inside its metal rails,
 * two deployed solar panels and crossed whip antennas.
 */
export const assembleCubeSat = (materials: SatelliteMaterials): Group => {
  const cubesat = new Group();
  cubesat.add(
    createBox(BODY, materials.panel),
    createRails(materials),
    createWhipAntennas(materials),
  );
  for (const side of [-1, 1]) {
    const panel = createBox(DEPLOYED_PANEL, materials.panel);
    panel.position.set(side * (BODY.x / 2 + DEPLOYED_PANEL.x / 2), 0, -BODY.z / 2);
    cubesat.add(panel);
  }
  return cubesat;
};
