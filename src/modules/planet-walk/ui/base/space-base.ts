import { Box3, Group, Vector3 } from 'three';
import { BASE_SITE, HABITAT_SPOT, LAYOUT } from './base-layout';
import { createRegolithSites } from './excavator/regolith-sites';
import { createSolarField } from './solar-field';
import { createCrossHabitat } from './habitat/cross-habitat';
import { createLandingPad } from './landing-pad.mesh';
import { LANDMARKS } from './landmarks/landmark-layout';
import type { SatelliteMaterials } from '@/modules/globe/ui/bodies/satellite/satellite.materials';
import type { Placement } from './base-layout';
import type { Obstacle, Spot } from '../../core/obstacles';
import type { StationSpots } from '../../core/station/station-actions';
import type { Object3D, WebGLRenderer } from 'three';
import { createSatelliteMaterials } from '@/modules/globe/ui/bodies/satellite/satellite.materials';

/** Returns where a spot given from the habitat's hall stands in the world. */
/** Where the astronaut stands after leaving the terminal: in front of its desk, facing it (m, from the hall's center). */
const TERMINAL_FRONT = { x: 0, z: -1.6, heading: Math.PI };

const fromHall = (spot: Spot): Spot => ({
  x: BASE_SITE.x + HABITAT_SPOT.x + spot.x,
  z: BASE_SITE.z + HABITAT_SPOT.z + spot.z,
});

/** Builds a piece of equipment at its size, standing on the ground at its place. */
const place = (materials: SatelliteMaterials, placement: Placement) => {
  const model = placement.assemble(materials);
  model.scale.setScalar(placement.scale);
  model.rotation.y = placement.turn ?? 0;
  const bounds = new Box3().setFromObject(model);
  const holder = new Group();
  holder.add(model);
  holder.position.set(placement.x, -bounds.min.y, placement.z);
  return holder;
};

/** Returns the box a building fills in the world, to bump into or climb on. */
const obstacleOf = (building: Object3D): Obstacle => {
  const { min, max } = new Box3().setFromObject(building);
  return {
    minX: min.x,
    maxX: max.x,
    minZ: min.z,
    maxZ: max.z,
    bottom: Math.max(min.y, 0),
    top: max.y,
  };
};

/**
 * Builds a space base mixing NASA's Moon and Mars concepts: the mission equipment grown to human
 * size, a cross-shaped habitat to walk into, a crew lander on its landing pad, an inflatable habitat,
 * a rover, cargo, lamp posts, a regolith dig site and its drop-off zone by the workshops. Returns it with the boxes its buildings
 * fill, the excavator robot's controls, where the dig site, its dig zone, the drop-off zone (with
 * its pile to fill), the station terminal and the ways
 * through the habitat's doors stand in the world.
 */
export const createSpaceBase = (renderer: WebGLRenderer) => {
  const materials = createSatelliteMaterials({ renderer, sunDirection: new Vector3(0, 1, 0) });
  const base = new Group();
  const buildings = [...LAYOUT, ...LANDMARKS].map((placement) => place(materials, placement));
  base.add(...buildings);
  const pad = createLandingPad();
  pad.position.x = 16;
  pad.position.z = 14;
  const { habitat, solids, passages, wakeUp } = createCrossHabitat();
  habitat.position.set(HABITAT_SPOT.x, 0, HABITAT_SPOT.z);
  const { sites, solids: siteSolids, ...regolith } = createRegolithSites();
  const solar = createSolarField(materials);
  base.add(pad, habitat, solar.field, ...sites);
  base.position.set(BASE_SITE.x, 0, BASE_SITE.z);
  base.updateMatrixWorld(true);
  const obstacles = [...buildings, ...solids, ...siteSolids, ...solar.solids].map(obstacleOf);
  const stationSpots: StationSpots = {
    console: fromHall({ x: 0, z: 0 }),
    wakeUp: { ...fromHall(wakeUp), heading: wakeUp.heading },
    terminalFront: { ...fromHall(TERMINAL_FRONT), heading: TERMINAL_FRONT.heading },
    passages: passages.map(({ from, to, ...door }) => ({
      ...door,
      from: fromHall(from),
      to: fromHall(to),
    })),
  };
  return { base, obstacles, stationSpots, aimSolarPanels: solar.aim, ...regolith };
};
