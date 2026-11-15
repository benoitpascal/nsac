import { HATCH, MODULE } from '../habitat-dimensions';
import type { HabitatBlock } from '../habitat-dimensions';

/** Round central hall (m): radius, wall thickness, height (as high as the modules), roof. */
export const HUB = {
  radius: 4.5,
  wall: 0.3,
  height: MODULE.axisHeight + MODULE.radius,
  roof: 0.25,
};

/** The upper storey on the hall's roof (m): its walls, its sloping top, its trim and light bars. */
export const STOREY = { height: 2.4, cap: 0.8, capShrink: 0.8, trim: 0.22 };

/** Half the angle a doorway takes in the round wall, seen from the center. */
export const DOOR_HALF_ANGLE = Math.asin(HATCH.width / 2 / HUB.radius);

const QUARTER_TURN = Math.PI / 2;
const POST = 0.5;
const POSTS = Math.ceil((2 * Math.PI * HUB.radius) / (POST * 0.9));
const CONSOLE = { size: 1.6, height: 0.9 };
const ROOF_SHORT_SIDE = 1.5 * HUB.radius;

/** Whether the angle (0 facing +z, turning towards +x) falls in one of the four doorways. */
const inDoorway = (angle: number) => {
  const fromDoor = Math.abs(((angle + QUARTER_TURN / 2) % QUARTER_TURN) - QUARTER_TURN / 2);
  return fromDoor < DOOR_HALF_ANGLE + POST / 2 / HUB.radius;
};

/**
 * Collision boxes following the round wall: a chain of small posts all around, rising from the
 * ground beside the doorways and starting above them in front of them.
 */
const wallPosts = (): HabitatBlock[] =>
  Array.from({ length: POSTS }, (_, index) => {
    const angle = (index / POSTS) * 2 * Math.PI;
    const bottom = inDoorway(angle) ? HATCH.height : 0;
    const [x, z] = [HUB.radius * Math.sin(angle), HUB.radius * Math.cos(angle)];
    return { x, z, width: POST, depth: POST, bottom, top: HUB.height };
  });

/** A cross of two boxes covering the octagon, between the given heights (m). */
const octagonCover = (bottom: number, top: number): HabitatBlock[] =>
  [
    [2 * HUB.radius, ROOF_SHORT_SIDE],
    [ROOF_SHORT_SIDE, 2 * HUB.radius],
  ].map(([width, depth]) => ({ x: 0, z: 0, width, depth, bottom, top }));

const ROOF_TOP = HUB.height + HUB.roof;

/**
 * Collision boxes of the hall: its wall with four doorways, its flat roof, the upper storey standing
 * on it, and its console.
 */
export const HUB_BLOCKS: HabitatBlock[] = [
  ...wallPosts(),
  ...octagonCover(HUB.height, ROOF_TOP),
  ...octagonCover(ROOF_TOP, ROOF_TOP + STOREY.height + STOREY.cap),
  { x: 0, z: 0, width: CONSOLE.size, depth: CONSOLE.size, bottom: 0, top: CONSOLE.height },
];

/** Size of the console in the middle of the hall (m). */
export const HUB_CONSOLE = CONSOLE;
