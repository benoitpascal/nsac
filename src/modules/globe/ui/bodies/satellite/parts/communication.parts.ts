import { Group } from 'three';
import {
  createBox,
  createCylinder,
  createDish,
  createSolarWing,
  ROD_RADIUS,
} from '../satellite.shapes';
import type { SatelliteMaterials } from '../satellite.materials';

const BUS = { x: 0.5, y: 0.6, z: 0.5 };
const WING = { from: BUS.x / 2, boomLength: 0.2, panelLength: 1.1, panelWidth: 0.45 };
const MAST_HEIGHT = 0.08;
const DISH_RADIUS = 0.28;
const DISH_OPENING = Math.PI / 3.5;
const FEED_LENGTH = 0.18;

const createAntenna = (materials: SatelliteMaterials) => {
  const busTop = BUS.y / 2;
  const mast = createCylinder(ROD_RADIUS, MAST_HEIGHT, 'y', materials.metal);
  mast.position.y = busTop + MAST_HEIGHT / 2;
  const dish = createDish(DISH_RADIUS, DISH_OPENING, materials.dish);
  dish.position.y = busTop + MAST_HEIGHT;
  const feed = createCylinder(ROD_RADIUS, FEED_LENGTH, 'y', materials.metal);
  feed.position.y = busTop + MAST_HEIGHT + FEED_LENGTH / 2;
  const antenna = new Group();
  antenna.add(mast, dish, feed);
  return antenna;
};

/**
 * Assembles a communication satellite: a foil-wrapped bus, two solar wings and a dish antenna.
 */
export const assembleCommunicationSatellite = (materials: SatelliteMaterials): Group => {
  const satellite = new Group();
  satellite.add(
    createBox(BUS, materials.foil),
    createSolarWing({ ...WING, side: 1 }, materials),
    createSolarWing({ ...WING, side: -1 }, materials),
    createAntenna(materials),
  );
  return satellite;
};
