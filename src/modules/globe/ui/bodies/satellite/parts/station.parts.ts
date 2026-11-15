import { Group } from 'three';
import { createBox, createCylinder } from '../satellite.shapes';
import type { SatelliteMaterials } from '../satellite.materials';

const TRUSS = { x: 2.4, y: 0.07, z: 0.07 };
const TRUSS_HEIGHT = 0.22;
const PYLON_RADIUS = 0.04;
const MODULE = { radius: 0.12, length: 0.42, count: 3, gap: 0.04 };
const ARRAY = { x: 0.2, y: 0.95, z: 0.012 };
const ARRAY_POSITIONS = [-1.05, -0.8, 0.8, 1.05];
const RADIATOR = { x: 0.35, y: 0.012, z: 0.5 };
const RADIATOR_POSITIONS = [-0.4, 0.4];

const createModules = (materials: SatelliteMaterials) => {
  const modules = new Group();
  for (let index = 0; index < MODULE.count; index++) {
    const module = createCylinder(MODULE.radius, MODULE.length, 'z', materials.whitePaint);
    module.position.z = (index - (MODULE.count - 1) / 2) * (MODULE.length + MODULE.gap);
    modules.add(module);
  }
  const pylon = createCylinder(PYLON_RADIUS, TRUSS_HEIGHT, 'y', materials.metal);
  pylon.position.y = TRUSS_HEIGHT / 2;
  modules.add(pylon);
  return modules;
};

const createTruss = (materials: SatelliteMaterials) => {
  const truss = new Group();
  truss.add(createBox(TRUSS, materials.metal));
  for (const x of ARRAY_POSITIONS) {
    for (const side of [1, -1]) {
      const array = createBox(ARRAY, materials.panel);
      array.position.set(x, side * (ARRAY.y / 2 + TRUSS.y / 2), 0);
      truss.add(array);
    }
  }
  for (const x of RADIATOR_POSITIONS) {
    const radiator = createBox(RADIATOR, materials.whitePaint);
    radiator.position.set(x, 0, RADIATOR.z / 2 + TRUSS.z / 2);
    truss.add(radiator);
  }
  truss.position.y = TRUSS_HEIGHT;
  return truss;
};

/**
 * Assembles a space station: a row of pressurized modules below a long truss
 * carrying four pairs of solar arrays and two radiators.
 */
export const assembleSpaceStation = (materials: SatelliteMaterials): Group => {
  const station = new Group();
  station.add(createModules(materials), createTruss(materials));
  station.position.y = -TRUSS_HEIGHT / 2;
  const centered = new Group();
  centered.add(station);
  return centered;
};
