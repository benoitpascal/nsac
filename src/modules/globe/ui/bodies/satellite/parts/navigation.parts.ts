import { Group } from 'three';
import { createBox, createCylinder, createSolarWing } from '../satellite.shapes';
import type { SatelliteMaterials } from '../satellite.materials';

const BUS = { x: 0.55, y: 0.55, z: 0.55 };
const WING = { from: BUS.x / 2, boomLength: 0.15, panelLength: 1, panelWidth: 0.5 };
const ANTENNAS = { columns: 4, rows: 3, spacing: 0.12, radius: 0.025, height: 0.14, sides: 12 };

const centeredOffset = (position: number, count: number) =>
  (position - (count - 1) / 2) * ANTENNAS.spacing;

const createAntennaArray = (materials: SatelliteMaterials) => {
  const array = new Group();
  for (let column = 0; column < ANTENNAS.columns; column++) {
    for (let row = 0; row < ANTENNAS.rows; row++) {
      const helix = createCylinder(
        ANTENNAS.radius,
        ANTENNAS.height,
        'y',
        materials.whitePaint,
        ANTENNAS.sides,
      );
      helix.position.set(
        centeredOffset(column, ANTENNAS.columns),
        BUS.y / 2 + ANTENNAS.height / 2,
        centeredOffset(row, ANTENNAS.rows),
      );
      array.add(helix);
    }
  }
  return array;
};

/**
 * Assembles a navigation satellite: a silver bus, two large solar wings
 * and an array of helical antennas pointing at the Earth.
 */
export const assembleNavigationSatellite = (materials: SatelliteMaterials): Group => {
  const satellite = new Group();
  satellite.add(
    createBox(BUS, materials.silverFoil),
    createSolarWing({ ...WING, side: 1 }, materials),
    createSolarWing({ ...WING, side: -1 }, materials),
    createAntennaArray(materials),
  );
  return satellite;
};
