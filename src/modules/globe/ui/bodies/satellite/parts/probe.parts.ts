import { Group } from 'three';
import { createCylinder, createDish, ROD_RADIUS } from '../satellite.shapes';
import type { SatelliteMaterials } from '../satellite.materials';

const DISH = { radius: 0.62, opening: Math.PI / 3.2 };
const BUS = { radius: 0.32, height: 0.28, sides: 10 };
const FEED = { length: 0.4, reflectorRadius: 0.06, reflectorThickness: 0.02 };
const BOOM_HEIGHT = -0.05;
const RTG = { boomLength: 0.9, radius: 0.07, length: 0.32 };
const MAGNETOMETER = { radius: 0.008, length: 1.3 };

const createFeed = (materials: SatelliteMaterials) => {
  const busTop = BUS.height / 2;
  const rod = createCylinder(ROD_RADIUS, FEED.length, 'y', materials.metal);
  rod.position.y = busTop + FEED.length / 2;
  const subreflector = createCylinder(
    FEED.reflectorRadius,
    FEED.reflectorThickness,
    'y',
    materials.dish,
  );
  subreflector.position.y = busTop + FEED.length;
  const feed = new Group();
  feed.add(rod, subreflector);
  return feed;
};

const createBooms = (materials: SatelliteMaterials) => {
  const rtgBoom = createCylinder(ROD_RADIUS, RTG.boomLength, 'x', materials.metal);
  rtgBoom.position.x = -(BUS.radius + RTG.boomLength / 2);
  const generator = createCylinder(RTG.radius, RTG.length, 'x', materials.darkMetal);
  generator.position.x = -(BUS.radius + RTG.boomLength + RTG.length / 2);
  const magnetometer = createCylinder(
    MAGNETOMETER.radius,
    MAGNETOMETER.length,
    'x',
    materials.metal,
  );
  magnetometer.position.x = BUS.radius + MAGNETOMETER.length / 2;
  const booms = new Group();
  booms.add(rtgBoom, generator, magnetometer);
  booms.position.y = BOOM_HEIGHT;
  return booms;
};

/**
 * Assembles a deep-space probe: a large high-gain dish on a compact ten-sided bus,
 * a boom carrying its nuclear power generator and a long magnetometer boom.
 */
export const assembleSpaceProbe = (materials: SatelliteMaterials): Group => {
  const bus = createCylinder(BUS.radius, BUS.height, 'y', materials.foil, BUS.sides);
  const dish = createDish(DISH.radius, DISH.opening, materials.dish);
  dish.position.y = BUS.height / 2;
  const probe = new Group();
  probe.add(bus, dish, createFeed(materials), createBooms(materials));
  return probe;
};
