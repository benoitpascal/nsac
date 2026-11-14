import { CylinderGeometry, Mesh } from 'three';
import { HATCH } from '../habitat-dimensions';
import { DOOR_HALF_ANGLE, HUB } from './hub-blocks';
import type { MeshStandardMaterial } from 'three';

const SEGMENTS = 64;
const QUARTER_TURN = Math.PI / 2;

/** A curved piece of the round wall, between two angles (0 facing +z) and two heights. */
const arc = (from: number, to: number, bottom: number, material: MeshStandardMaterial) => {
  const height = HUB.height - bottom;
  const geometry = new CylinderGeometry(
    HUB.radius,
    HUB.radius,
    height,
    SEGMENTS,
    1,
    true,
    from,
    to - from,
  );
  const mesh = new Mesh(geometry, material);
  mesh.position.y = bottom + height / 2;
  return mesh;
};

/** The round wall: four full-height arcs between the doorways, and an arc above each doorway. */
export const createHubWall = (material: MeshStandardMaterial) =>
  [0, 1, 2, 3].flatMap((quarter) => {
    const door = quarter * QUARTER_TURN;
    return [
      arc(door + DOOR_HALF_ANGLE, door + QUARTER_TURN - DOOR_HALF_ANGLE, 0, material),
      arc(door - DOOR_HALF_ANGLE, door + DOOR_HALF_ANGLE, HATCH.height, material),
    ];
  });
