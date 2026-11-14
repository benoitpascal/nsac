import { Group } from 'three';
import { createBox, createCylinder, createSolarWing, ROD_RADIUS } from '../satellite.shapes';
import type { SatelliteMaterials } from '../satellite.materials';

const BUS = { x: 0.45, y: 0.5, z: 0.45 };
const WING = { from: BUS.x / 2, boomLength: 0.15, panelLength: 0.8, panelWidth: 0.4 };
const RADAR = { x: 1.9, y: 0.04, z: 0.5 };
const RADAR_DROP = 0.08;
const STRUT_OFFSETS = [-0.15, 0.15];

/**
 * Assembles a radar observation satellite: a compact bus, two solar wings
 * and a long flat radar antenna hanging below it.
 */
export const assembleRadarSatellite = (materials: SatelliteMaterials): Group => {
  const busBottom = -BUS.y / 2;
  const radar = createBox(RADAR, materials.darkMetal);
  radar.position.y = busBottom - RADAR_DROP - RADAR.y / 2;
  const satellite = new Group();
  satellite.add(
    createBox(BUS, materials.foil),
    createSolarWing({ ...WING, side: 1 }, materials),
    createSolarWing({ ...WING, side: -1 }, materials),
    radar,
  );
  for (const offset of STRUT_OFFSETS) {
    const strut = createCylinder(ROD_RADIUS, RADAR_DROP, 'y', materials.metal);
    strut.position.set(offset, busBottom - RADAR_DROP / 2, 0);
    satellite.add(strut);
  }
  return satellite;
};
