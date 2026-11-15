import { Group, MeshStandardMaterial } from 'three';
import { blockMesh } from '../habitat-dimensions';
import { HUB } from './hub-blocks';
import type { HabitatBlock } from '../habitat-dimensions';

/** Short corridor between the hall's doorway and a module's hatch (m), along +z. */
export const CONNECTOR = { length: 1.2, inner: 1.5, wall: 0.2, height: 2.4, roof: 0.2 };

const START = HUB.radius - HUB.wall;
const END = HUB.radius + CONNECTOR.length;
const LENGTH = END - START;
const MIDDLE = (START + END) / 2;
const SIDE_X = CONNECTOR.inner / 2 + CONNECTOR.wall / 2;
const COLOR = 0xdfe2e7;
const FLOOR = { color: 0x3a3f4a, top: 0.02 };

// prettier-ignore
const BLOCKS: HabitatBlock[] = [
  { x: -SIDE_X, z: MIDDLE, width: CONNECTOR.wall, depth: LENGTH, bottom: 0, top: CONNECTOR.height },
  { x: SIDE_X, z: MIDDLE, width: CONNECTOR.wall, depth: LENGTH, bottom: 0, top: CONNECTOR.height },
  { x: 0, z: MIDDLE, width: CONNECTOR.inner + 2 * CONNECTOR.wall, depth: LENGTH, bottom: CONNECTOR.height, top: CONNECTOR.height + CONNECTOR.roof },
];

/**
 * Builds the corridor joining the hall to a module (towards +z): a floor, two walls and a roof, taller
 * than the hatch it leads to. Its walls and roof are both what it looks like and what the walker
 * bumps into.
 */
export const createConnector = () => {
  const material = new MeshStandardMaterial({ color: COLOR, roughness: 0.6 });
  const solids = BLOCKS.map((block) => blockMesh(block, material));
  const floor = blockMesh(
    { x: 0, z: MIDDLE, width: CONNECTOR.inner, depth: LENGTH, bottom: 0, top: FLOOR.top },
    new MeshStandardMaterial({ color: FLOOR.color, roughness: 0.9 }),
  );
  const connector = new Group();
  connector.add(...solids, floor);
  return { connector, solids };
};
