import { CapsuleGeometry, Group, Mesh, MeshStandardMaterial, TorusGeometry } from 'three';
import {
  createBox,
  createCylinder,
  QUARTER_TURN,
  ROUND_SEGMENTS,
} from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const TANK = { radius: 0.33, length: 0.9 };
const BAND = { width: 0.08, offsets: [-0.3, 0.3] };
const SADDLE = { x: 0.12, y: 0.16, z: 0.5, offsets: [-0.35, 0.35] };
const GAUGE = { x: 0.6, y: 0.05, z: 0.02, fill: 0.55 };
const VALVE = { radius: 0.04, height: 0.1, wheelRadius: 0.08, wheelTube: 0.012 };
const WATER_BLUE = 0x2563eb;
const CAP_SEGMENTS = 12;

const createValve = (materials: SatelliteMaterials) => {
  const stem = createCylinder(VALVE.radius, VALVE.height, 'y', materials.metal);
  stem.position.y = TANK.radius + VALVE.height / 2;
  const wheel = new Mesh(
    new TorusGeometry(VALVE.wheelRadius, VALVE.wheelTube, 8, ROUND_SEGMENTS),
    materials.metal,
  );
  wheel.rotation.x = QUARTER_TURN;
  wheel.position.y = TANK.radius + VALVE.height;
  const valve = new Group();
  valve.add(stem, wheel);
  return valve;
};

/**
 * Assembles a water tank: a white pressure vessel with blue bands, a level gauge
 * showing the water inside, a valve on top and two support saddles.
 */
export const assembleWaterTank = (materials: SatelliteMaterials): Group => {
  const water = new MeshStandardMaterial({ color: WATER_BLUE, roughness: 0.3 });
  const shell = new Mesh(
    new CapsuleGeometry(TANK.radius, TANK.length, CAP_SEGMENTS, ROUND_SEGMENTS),
    materials.whitePaint,
  );
  shell.rotation.z = QUARTER_TURN;
  const tank = new Group();
  tank.add(shell, createValve(materials));
  for (const offset of BAND.offsets) {
    const band = createCylinder(TANK.radius * 1.01, BAND.width, 'x', water);
    band.position.x = offset;
    tank.add(band);
  }
  const gaugeFrame = createBox(GAUGE, materials.darkMetal);
  gaugeFrame.position.z = TANK.radius;
  const level = createBox({ ...GAUGE, x: GAUGE.x * GAUGE.fill, z: GAUGE.z * 1.2 }, water);
  level.position.set(-(GAUGE.x * (1 - GAUGE.fill)) / 2, 0, TANK.radius);
  tank.add(gaugeFrame, level);
  for (const offset of SADDLE.offsets) {
    const saddle = createBox(SADDLE, materials.darkMetal);
    saddle.position.set(offset, -TANK.radius, 0);
    tank.add(saddle);
  }
  return tank;
};
