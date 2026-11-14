import { CapsuleGeometry, CircleGeometry, Group, Mesh, TorusGeometry } from 'three';
import {
  createCylinder,
  QUARTER_TURN,
  ROD_RADIUS,
  ROUND_SEGMENTS,
} from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const HULL = { radius: 0.4, length: 1.1 };
const CAP_SEGMENTS = 16;
const RIB = { width: 0.05, offsets: [-0.35, 0, 0.35] };
const PORTHOLE = { radius: 0.07, frameTube: 0.012, offsets: [-0.18, 0.18] };
const AIRLOCK = { radius: 0.2, length: 0.2, hatchRadius: 0.14 };
const HANDRAIL = { length: 0.9, lift: 0.05 };

const createPorthole = (materials: SatelliteMaterials) => {
  const pane = new Mesh(new CircleGeometry(PORTHOLE.radius, ROUND_SEGMENTS), materials.aperture);
  const frame = new Mesh(
    new TorusGeometry(PORTHOLE.radius, PORTHOLE.frameTube, 8, ROUND_SEGMENTS),
    materials.metal,
  );
  const porthole = new Group();
  porthole.add(pane, frame);
  porthole.position.z = HULL.radius + 0.002;
  return porthole;
};

const createAirlock = (materials: SatelliteMaterials) => {
  const hullEnd = HULL.length / 2 + HULL.radius;
  const tunnel = createCylinder(AIRLOCK.radius, AIRLOCK.length, 'x', materials.silverFoil);
  tunnel.position.x = hullEnd + AIRLOCK.length / 2 - HULL.radius * 0.3;
  const hatch = new Mesh(
    new CircleGeometry(AIRLOCK.hatchRadius, ROUND_SEGMENTS),
    materials.darkMetal,
  );
  hatch.rotation.y = QUARTER_TURN;
  hatch.position.x = tunnel.position.x + AIRLOCK.length / 2 + 0.002;
  const airlock = new Group();
  airlock.add(tunnel, hatch);
  return airlock;
};

/**
 * Assembles a habitat module: a pressurized hull with rounded ends, reinforcing ribs,
 * portholes, a handrail and an airlock at one end.
 */
export const assembleHabitatModule = (materials: SatelliteMaterials): Group => {
  const hull = new Mesh(
    new CapsuleGeometry(HULL.radius, HULL.length, CAP_SEGMENTS, ROUND_SEGMENTS),
    materials.whitePaint,
  );
  hull.rotation.z = QUARTER_TURN;
  const handrail = createCylinder(ROD_RADIUS, HANDRAIL.length, 'x', materials.metal);
  handrail.position.y = HULL.radius + HANDRAIL.lift;
  const habitat = new Group();
  habitat.add(hull, handrail, createAirlock(materials));
  for (const offset of RIB.offsets) {
    const rib = createCylinder(HULL.radius * 1.015, RIB.width, 'x', materials.silverFoil);
    rib.position.x = offset;
    habitat.add(rib);
  }
  for (const offset of PORTHOLE.offsets) {
    const porthole = createPorthole(materials);
    porthole.position.x = offset;
    habitat.add(porthole);
  }
  habitat.position.x = -AIRLOCK.length / 2;
  const centered = new Group();
  centered.add(habitat);
  return centered;
};
