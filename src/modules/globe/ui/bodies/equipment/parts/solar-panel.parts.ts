import { Group } from 'three';
import { createBox, createCylinder, QUARTER_TURN } from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const PANEL = { x: 1.6, y: 0.03, z: 0.9 };
const FRAME_WIDTH = 0.04;
const BRACKET = { x: 0.3, y: 0.08, z: 0.2 };
const MOUNT = { radius: 0.03, length: 0.3 };

const createFrame = (materials: SatelliteMaterials) => {
  const frame = new Group();
  const height = PANEL.y + 0.01;
  for (const side of [1, -1]) {
    const long = createBox(
      { x: PANEL.x + FRAME_WIDTH * 2, y: height, z: FRAME_WIDTH },
      materials.metal,
    );
    long.position.z = side * (PANEL.z / 2 + FRAME_WIDTH / 2);
    const short = createBox({ x: FRAME_WIDTH, y: height, z: PANEL.z }, materials.metal);
    short.position.x = side * (PANEL.x / 2 + FRAME_WIDTH / 2);
    frame.add(long, short);
  }
  return frame;
};

/**
 * Assembles a standalone solar panel: a framed array of photovoltaic cells
 * with a mounting bracket and a pivot on its back, standing upright to face the viewer.
 */
export const assembleSolarPanel = (materials: SatelliteMaterials): Group => {
  const bracket = createBox(BRACKET, materials.darkMetal);
  bracket.position.y = -(PANEL.y / 2 + BRACKET.y / 2);
  const mount = createCylinder(MOUNT.radius, MOUNT.length, 'y', materials.metal);
  mount.position.y = -(PANEL.y / 2 + BRACKET.y + MOUNT.length / 2);
  const panel = new Group();
  panel.add(createBox(PANEL, materials.panel), createFrame(materials), bracket, mount);
  panel.rotation.x = QUARTER_TURN;
  const upright = new Group();
  upright.add(panel);
  return upright;
};
