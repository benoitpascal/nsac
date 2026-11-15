import { BoxGeometry, CylinderGeometry, Group, Mesh } from 'three';
import type { SatelliteMaterials } from '@/modules/globe/ui/bodies/satellite/satellite.materials';
import type { Vector3 } from 'three';

/**
 * A tall solar array on a mast, like NASA's Vertical Solar Array Technology (VSAT): the mast's head
 * turns and the panel tips back all day long to keep it facing the Sun, which crosses high over
 * the base near the equator (m).
 */
const MAST = { radius: 0.12, height: 6, foot: 0.45 };
const PANEL = { width: 3, height: 3.6, thickness: 0.06, center: 4 };
const FRAME = 0.06;
/** The panel tips back at most this much (radians), almost flat when the Sun is overhead. */
const MAX_TILT = 1.45;

const box = (width: number, height: number, depth: number, material: SatelliteMaterials['metal']) =>
  new Mesh(new BoxGeometry(width, height, depth), material);

/** The mast standing on its foot, from the ground up. */
const mast = (materials: SatelliteMaterials) => {
  const pole = new Mesh(
    new CylinderGeometry(MAST.radius, MAST.radius * 1.4, MAST.height, 16),
    materials.darkMetal,
  );
  pole.position.y = MAST.height / 2;
  pole.castShadow = true;
  const foot = new Mesh(new CylinderGeometry(MAST.foot, MAST.foot * 1.2, 0.2, 20), materials.metal);
  foot.position.y = 0.1;
  const column = new Group();
  column.add(pole, foot);
  return column;
};

/** The panel facing +z from its hinge: cells in a metal frame, with a brace on its back. */
const panel = (materials: SatelliteMaterials) => {
  const back = materials.darkMetal;
  /** Cells on the sunny face only (+z); bare metal on the back and the edges. */
  const cells = new Mesh(new BoxGeometry(PANEL.width, PANEL.height, PANEL.thickness), [
    back,
    back,
    back,
    back,
    materials.panel,
    back,
  ]);
  const frame = new Group();
  for (const side of [-1, 1]) {
    const upright = box(FRAME, PANEL.height + FRAME * 2, FRAME, materials.metal);
    upright.position.x = side * (PANEL.width / 2 + FRAME / 2);
    const rail = box(PANEL.width, FRAME, FRAME, materials.metal);
    rail.position.y = side * (PANEL.height / 2 + FRAME / 2);
    frame.add(upright, rail);
  }
  const brace = box(0.18, PANEL.height * 0.9, 0.18, materials.darkMetal);
  brace.position.z = -0.15;
  const array = new Group();
  array.add(cells, frame, brace);
  array.position.z = MAST.radius + 0.25;
  array.traverse((part) => {
    part.castShadow = true;
  });
  return array;
};

/** Builds one sun-tracking array; `aim` turns it to face the given direction to the Sun. */
export const createSolarTracker = (materials: SatelliteMaterials) => {
  const tilt = new Group();
  tilt.add(panel(materials));
  const head = new Group();
  head.position.y = PANEL.center;
  head.add(tilt);
  const column = mast(materials);
  const tracker = new Group();
  tracker.add(column, head);
  return {
    tracker,
    /** The part one bumps into: the panel turns high above the head. */
    solid: column,
    aim: (toSun: Vector3) => {
      head.rotation.y = Math.atan2(toSun.x, toSun.z);
      tilt.rotation.x = -Math.min(Math.max(Math.asin(toSun.y), 0), MAX_TILT);
    },
  };
};
