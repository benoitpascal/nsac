import { Group, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { createAirlockDoor } from './airlock-door';
import { endBlocks, habitatBlocks } from './habitat-blocks';
import { blockMesh, MODULE } from './habitat-dimensions';
import { createHabitatHull } from './habitat-hull';
import { doorwayWalls, wingLamps } from './zones/wing-fittings';
import { wingSigns } from './zones/wing-signs';
import { createZoneRoom } from './zones/zone-room';
import type { DoorLabels, WingPlan } from './zones/zone-plan';

const FLOOR = {
  color: 0x3a3f4a,
  top: 0.02,
  halfWidth: Math.sqrt(MODULE.radius ** 2 - MODULE.axisHeight ** 2),
};

/** A closed door of a wing: how far (m) from the wing's hall end, and what E says to go through it. */
export type WingDoor = { at: number; labels: DoorLabels; outer: boolean };

/** Returns the walls across the wing (z, from its center): its hall end, between rooms, its outer end. */
const wallsOf = (plan: WingPlan) => {
  const length = plan.zones.reduce((sum, zone) => sum + zone.length, 0);
  const walls = [-length / 2];
  for (const zone of plan.zones) walls.push(walls[walls.length - 1] + zone.length);
  return walls;
};

/**
 * Builds a wing of the habitat along z, its hall end towards -z: a module as long as its rooms,
 * walls with a framed doorway between rooms, signs naming them, their furniture and lights, and
 * its closed doors. Returns it with its solid parts, its length and its doors.
 */
export const createWing = (plan: WingPlan) => {
  const walls = wallsOf(plan);
  const length = walls[walls.length - 1] - walls[0];
  const ends = { front: Boolean(plan.outerDoor), back: true };
  const hull = createHabitatHull(ends, length);
  hull.position.y = MODULE.axisHeight;
  const inner = walls.slice(1, -1);
  const blocks = [...habitatBlocks(ends, length), ...inner.flatMap((z) => endBlocks(z, true))];
  const hidden = new MeshBasicMaterial();
  const solids = blocks.map((block) => Object.assign(blockMesh(block, hidden), { visible: false }));
  const floor = blockMesh(
    { x: 0, z: 0, width: 2 * FLOOR.halfWidth, depth: length, bottom: 0, top: FLOOR.top },
    new MeshStandardMaterial({ color: FLOOR.color, roughness: 0.9 }),
  );
  const wing = new Group();
  wing.add(hull, floor, ...solids, ...wingLamps(length), ...doorwayWalls(inner));
  wing.add(...wingSigns(plan, walls));
  plan.zones.forEach((zone, index) => {
    const { room, solids: furniture } = createZoneRoom(zone);
    room.position.z = (walls[index] + walls[index + 1]) / 2;
    wing.add(room);
    solids.push(...furniture);
  });
  const doors: WingDoor[] = [];
  const closeWith = (z: number, labels: DoorLabels, outer: boolean) => {
    const { door, solid } = createAirlockDoor();
    door.position.z = z;
    wing.add(door);
    solids.push(solid);
    doors.push({ at: z - walls[0], labels, outer });
  };
  plan.zones.forEach((zone, index) => {
    if (zone.entryDoor) closeWith(walls[index], zone.entryDoor, false);
  });
  if (plan.outerDoor) closeWith(walls[walls.length - 1], plan.outerDoor, true);
  return { wing, solids, length, doors };
};
