import { Group, MeshStandardMaterial } from 'three';
import {
  createBox,
  createCylinder,
  createDish,
  ROD_RADIUS,
} from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const LEG = { length: 0.55, spread: 0.45, count: 3, footRadius: 0.16 };
const MAST = { radius: 0.035, height: 0.55 };
const GIMBAL = { x: 0.12, y: 0.1, z: 0.12 };
const DISH = { radius: 0.42, opening: Math.PI / 3.3, tilt: 0.7 };
const FEED = { length: 0.32, reflectorRadius: 0.05 };
const TRANSMITTER = { x: 0.22, y: 0.16, z: 0.14 };
const LED = { x: 0.04, y: 0.02, z: 0.01 };
const SIGNAL_RED = 0xef4444;

const createTripod = (materials: SatelliteMaterials) => {
  const tripod = new Group();
  for (let index = 0; index < LEG.count; index++) {
    const leg = createCylinder(ROD_RADIUS, LEG.length, 'y', materials.metal);
    leg.rotation.z = LEG.spread;
    leg.position.set(LEG.footRadius / 2, -LEG.length / 2, 0);
    const holder = new Group();
    holder.add(leg);
    holder.rotation.y = (index / LEG.count) * Math.PI * 2;
    tripod.add(holder);
  }
  return tripod;
};

const createDishAssembly = (materials: SatelliteMaterials) => {
  const dish = createDish(DISH.radius, DISH.opening, materials.dish);
  const feed = createCylinder(ROD_RADIUS, FEED.length, 'y', materials.metal);
  feed.position.y = FEED.length / 2;
  const reflector = createCylinder(FEED.reflectorRadius, 0.02, 'y', materials.dish);
  reflector.position.y = FEED.length;
  const assembly = new Group();
  assembly.add(dish, feed, reflector);
  assembly.rotation.x = DISH.tilt;
  assembly.position.y = MAST.height + GIMBAL.y;
  return assembly;
};

/**
 * Assembles a relay antenna: a dish on a pointing gimbal, raised on a mast and tripod,
 * with its transmitter box at the foot of the mast.
 */
export const assembleRelayAntenna = (materials: SatelliteMaterials): Group => {
  const mast = createCylinder(MAST.radius, MAST.height, 'y', materials.metal);
  mast.position.y = MAST.height / 2;
  const gimbal = createBox(GIMBAL, materials.darkMetal);
  gimbal.position.y = MAST.height + GIMBAL.y / 2;
  const transmitter = createBox(TRANSMITTER, materials.whitePaint);
  transmitter.position.set(0, TRANSMITTER.y / 2, MAST.radius + TRANSMITTER.z / 2);
  const ledMaterial = new MeshStandardMaterial({ color: SIGNAL_RED, emissive: SIGNAL_RED });
  const led = createBox(LED, ledMaterial);
  led.position.set(0, TRANSMITTER.y * 0.7, MAST.radius + TRANSMITTER.z + LED.z / 2);
  const antenna = new Group();
  antenna.add(
    createTripod(materials),
    mast,
    gimbal,
    transmitter,
    led,
    createDishAssembly(materials),
  );
  antenna.position.y = -(MAST.height - LEG.length) / 2 - 0.15;
  const centered = new Group();
  centered.add(antenna);
  return centered;
};
