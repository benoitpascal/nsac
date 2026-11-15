import { BODY_HEIGHT_M, ceilingAt, floorAt, freeSpot } from './obstacles';
import type { Obstacle } from './obstacles';

/**
 * Where the walker stands (m), how fast they rise or fall (m/s), and which way they face
 * (heading in radians, 0 looking along -z, turning left as it grows).
 */
export type Walker = {
  x: number;
  z: number;
  height: number;
  verticalSpeed: number;
  heading: number;
  /** Time (s) left bending the legs before a jump leaves the ground, if one is starting. */
  windUp?: number;
};

/**
 * What the walker wants to do: move forward (1) or back (-1), run instead of walking, keep
 * turning right (1) or left (-1), jump, and turn at once by an angle (radians, right positive),
 * as with the mouse.
 */
export type WalkerInput = {
  forward: number;
  run: boolean;
  turn: number;
  jump: boolean;
  turnBy: number;
};

/** Walking speed in m/s, the same on every world. */
export const WALK_SPEED = 3;
/** Running speed in m/s, the same on every world. */
export const RUN_SPEED = 6;
/** Take-off speed of a jump in m/s, the same leg push on every world. */
export const JUMP_SPEED = 3;
/** Time (s) the legs bend before a jump leaves the ground, as they do before any real jump. */
export const JUMP_WIND_UP_S = 0.25;
/** Turning speed in radians per second (about a third of a turn per second). */
export const TURN_SPEED = 2;
/** The walker stays within this distance (m) of the starting point. */
const AREA_RADIUS = 500;

/** Starts standing at the center of the area. */
export const startWalker = (): Walker => ({ x: 0, z: 0, height: 0, verticalSpeed: 0, heading: 0 });

const moveFlat = (walker: Walker, input: WalkerInput, heading: number, seconds: number) => {
  const step = (input.run ? RUN_SPEED : WALK_SPEED) * seconds * input.forward;
  const x = walker.x - Math.sin(heading) * step;
  const z = walker.z - Math.cos(heading) * step;
  const distance = Math.hypot(x, z);
  const inside = distance > AREA_RADIUS ? AREA_RADIUS / distance : 1;
  return { x: x * inside, z: z * inside };
};

/** Starts bending the legs when a jump is asked, then counts down to the take-off. */
const nextWindUp = (left: number, jump: boolean, seconds: number) => {
  if (left > 0) return Math.max(0, left - seconds);
  return jump ? JUMP_WIND_UP_S : 0;
};

/**
 * Returns the walker after the given time under the given gravity (m/s²): turning, walking and
 * running keep the same speed everywhere, while a jump only starts from what the walker stands on,
 * leaves it once the legs have bent, and gravity pulls it back. Obstacles block the way, or carry the walker when low enough or landed
 * on; walking off their edge makes the walker fall, and a ceiling stops a jump.
 */
export const stepWalker = (
  walker: Walker,
  input: WalkerInput,
  gravity: number,
  seconds: number,
  obstacles: readonly Obstacle[] = [],
): Walker => {
  const heading = walker.heading - input.turn * TURN_SPEED * seconds - input.turnBy;
  const wanted = moveFlat(walker, input, heading, seconds);
  const spot = freeSpot(obstacles, walker, wanted, walker.height);
  const floor = floorAt(obstacles, spot, walker.height);
  const headroom = ceilingAt(obstacles, spot, walker.height) - BODY_HEIGHT_M;
  const standing = walker.height <= floor && walker.verticalSpeed <= 0;
  const windUp = standing ? nextWindUp(walker.windUp ?? 0, input.jump, seconds) : 0;
  const takeOff = standing && walker.windUp !== undefined && walker.windUp > 0 && windUp === 0;
  const speed = standing ? (takeOff ? JUMP_SPEED : 0) : walker.verticalSpeed;
  const rise = walker.height + speed * seconds - (gravity * seconds * seconds) / 2;
  const bumped = rise > headroom;
  const height = Math.max(Math.min(rise, headroom), floor);
  const landed = height <= floor;
  const fallSpeed = bumped ? Math.min(0, speed) : speed - gravity * seconds;
  return { ...spot, heading, height, verticalSpeed: landed ? 0 : fallSpeed, windUp };
};
