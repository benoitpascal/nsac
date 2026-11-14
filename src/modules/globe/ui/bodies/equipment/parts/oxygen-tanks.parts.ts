import { CapsuleGeometry, Group, Mesh, MeshStandardMaterial, TorusGeometry } from 'three';
import { createCylinder, QUARTER_TURN, ROUND_SEGMENTS } from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const TANK = { radius: 0.18, length: 0.8, spacing: 0.38, count: 3 };
const CAP_SEGMENTS = 12;
const OXYGEN_GREEN = 0x2f9e5b;
const BAND = { height: 0.14, offset: 0.25 };
const PLATE = { height: 0.05, offsets: [-0.22, 0.22], radius: 0.4 };
const VALVE = { radius: 0.035, height: 0.12, wheelRadius: 0.07, wheelTube: 0.012 };

const createTank = (materials: SatelliteMaterials, bandMaterial: MeshStandardMaterial) => {
  const shell = new Mesh(
    new CapsuleGeometry(TANK.radius, TANK.length, CAP_SEGMENTS, ROUND_SEGMENTS),
    materials.whitePaint,
  );
  const band = createCylinder(TANK.radius * 1.01, BAND.height, 'y', bandMaterial);
  band.position.y = BAND.offset;
  const tankTop = TANK.length / 2 + TANK.radius;
  const valve = createCylinder(VALVE.radius, VALVE.height, 'y', materials.metal);
  valve.position.y = tankTop + VALVE.height / 2;
  const wheel = new Mesh(
    new TorusGeometry(VALVE.wheelRadius, VALVE.wheelTube, 8, ROUND_SEGMENTS),
    materials.metal,
  );
  wheel.rotation.x = QUARTER_TURN;
  wheel.position.y = tankTop + VALVE.height;
  const tank = new Group();
  tank.add(shell, band, valve, wheel);
  return tank;
};

/**
 * Assembles a rack of three oxygen tanks: white pressure vessels with a green band and a valve,
 * held together by two metal plates.
 */
export const assembleOxygenTanks = (materials: SatelliteMaterials): Group => {
  const bandMaterial = new MeshStandardMaterial({ color: OXYGEN_GREEN, roughness: 0.6 });
  const rack = new Group();
  for (let index = 0; index < TANK.count; index++) {
    const angle = (index / TANK.count) * Math.PI * 2;
    const tank = createTank(materials, bandMaterial);
    const clusterRadius = TANK.spacing / Math.sqrt(3);
    tank.position.set(Math.cos(angle) * clusterRadius, 0, Math.sin(angle) * clusterRadius);
    rack.add(tank);
  }
  for (const offset of PLATE.offsets) {
    const plate = createCylinder(PLATE.radius, PLATE.height, 'y', materials.darkMetal);
    plate.position.y = offset;
    rack.add(plate);
  }
  return rack;
};
