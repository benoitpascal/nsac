import { Group, Mesh, PlaneGeometry } from 'three';
import { HATCH } from '../habitat-dimensions';
import { HUB } from './hub-blocks';
import type { MeshStandardMaterial } from 'three';

const SIDES = 8;
const SIDE_ANGLE = (2 * Math.PI) / SIDES;
/** Width (m) of one flat side of the octagonal hall, its middle standing on the round wall's circle. */
export const HUB_SIDE = 2 * HUB.radius * Math.tan(Math.PI / SIDES);
/** Distance (m) from the hall's center to its corners. */
export const HUB_CORNER = HUB.radius / Math.cos(Math.PI / SIDES);

/** A flat piece of wall facing +z, its middle at the given place across it (m). */
const piece = (
  width: number,
  bottom: number,
  top: number,
  across: number,
  material: MeshStandardMaterial,
) => {
  const mesh = new Mesh(new PlaneGeometry(width, top - bottom), material);
  mesh.position.set(across, (bottom + top) / 2, 0);
  return mesh;
};

/** One side of the octagon, with a doorway cut in its middle when asked. */
const side = (withDoorway: boolean, material: MeshStandardMaterial) => {
  const wall = new Group();
  if (!withDoorway) {
    wall.add(piece(HUB_SIDE, 0, HUB.height, 0, material));
    return wall;
  }
  const jamb = (HUB_SIDE - HATCH.width) / 2;
  const offset = HATCH.width / 2 + jamb / 2;
  wall.add(
    piece(jamb, 0, HUB.height, -offset, material),
    piece(jamb, 0, HUB.height, offset, material),
    piece(HATCH.width, HATCH.height, HUB.height, 0, material),
  );
  return wall;
};

/**
 * The hall's wall: eight flat sides around the round wall's circle, a doorway in the four sides
 * facing the modules (towards +z, +x, -z and -x).
 */
export const createHubWall = (material: MeshStandardMaterial) =>
  Array.from({ length: SIDES }, (_, index) => {
    const angle = index * SIDE_ANGLE;
    const wall = side(index % 2 === 0, material);
    wall.rotation.y = angle;
    wall.position.set(Math.sin(angle) * HUB.radius, 0, Math.cos(angle) * HUB.radius);
    return wall;
  });
