import type { Spot } from '../obstacles';
import type { Walker } from '../walker';

/** What the astronaut is busy with: walking, reading the station dashboard, or driving the excavator. */
export type Activity = 'walking' | 'dashboard' | 'driving';

/**
 * A way through a closed door, one direction of it: where the astronaut stands to open it, where
 * they come out on the other side, and what the action key says.
 */
/** A way through a door; `leavesBase` when it steps out of the base onto the Moon. */
export type DoorPassage = { from: Spot; to: Spot; label: string; leavesBase?: boolean };

/** A spot where the astronaut appears, facing the given heading. */
export type StartSpot = Spot & { heading: number };

/**
 * Where the station's controls are used: at its terminal, and in front of each side of its doors;
 * where the astronaut wakes up (the crew quarters), and where they stand after leaving the terminal.
 */
export type StationSpots = {
  console: Spot;
  passages: readonly DoorPassage[];
  wakeUp: StartSpot;
  terminalFront: StartSpot;
};

/** What the action key does at a given moment. */
export type StationAction =
  | { kind: 'openDashboard' }
  | { kind: 'closeDashboard' }
  | { kind: 'leaveExcavator' }
  | { kind: 'passDoor'; passage: DoorPassage };

/** How close (m) the astronaut must stand to the terminal, or in front of a door, to use it. */
const CONSOLE_REACH_M = 2.2;
const DOOR_REACH_M = 1.5;

const distance = (a: Spot, b: Spot) => Math.hypot(a.x - b.x, a.z - b.z);

/** Returns the passage whose starting spot is nearest the walker, if within reach. */
const nearestPassage = (walker: Spot, passages: readonly DoorPassage[]) =>
  passages
    .filter((passage) => distance(walker, passage.from) <= DOOR_REACH_M)
    .sort((a, b) => distance(walker, a.from) - distance(walker, b.from))[0];

/**
 * Returns what the action key does now, if anything: it closes the dashboard or hands the robot
 * back at any time, opens the dashboard at the terminal, and goes through the nearest door.
 */
export const availableAction = (
  activity: Activity,
  walker: Spot,
  spots: StationSpots,
): StationAction | undefined => {
  if (activity === 'dashboard') return { kind: 'closeDashboard' };
  if (activity === 'driving') return { kind: 'leaveExcavator' };
  if (distance(walker, spots.console) <= CONSOLE_REACH_M) return { kind: 'openDashboard' };
  const passage = nearestPassage(walker, spots.passages);
  return passage && { kind: 'passDoor', passage };
};

/** Returns what the astronaut is busy with after the action. */
export const activityAfter = (action: StationAction): Activity =>
  action.kind === 'openDashboard' ? 'dashboard' : 'walking';

/** Returns the walker carried through a door, standing on its other side and facing away from it. */
export const passDoor = (walker: Walker, { from, to }: DoorPassage): Walker => ({
  ...walker,
  x: to.x,
  z: to.z,
  height: 0,
  verticalSpeed: 0,
  heading: Math.atan2(from.x - to.x, from.z - to.z),
});
