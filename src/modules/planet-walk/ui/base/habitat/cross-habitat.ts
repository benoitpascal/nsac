import { Group } from 'three';
import { CONNECTOR, createConnector } from './hub/connector';
import { createHub } from './hub/hub';
import { HUB } from './hub/hub-blocks';
import { createWing } from './wing';
import { INDUSTRY_WING } from './zones/industry-wing';
import { OPERATIONS_WING } from './zones/operations-wing';
import { RESIDENTIAL_WING } from './zones/residential-wing';
import { SCIENCE_WING } from './zones/science-wing';
import { createZoneSign } from './zones/zone-sign';
import { arrowsAlong, arrowsAround, createExitSign } from './exit-guidance';
import type { DoorPassage } from '../../../core/station/station-actions';
import type { WingDoor } from './wing';
import type { Object3D } from 'three';

const QUARTER_TURN = Math.PI / 2;
/** Distance (m) from the hall's center to the hall end of a wing. */
const WING_START = HUB.radius + CONNECTOR.length;
/** Where the astronaut stands to open a door, from the door (m): further out past the outer door's frame. */
const DOOR_STEP = { inside: 0.9, outside: 0.9, outer: 1.3 };
/** The sign above each doorway of the hall (m): in front of the corridor that starts in the wall. */
const HALL_SIGN = { height: 2.8, radius: HUB.radius - HUB.wall - 0.12 };

/** The way out (m): the EXIT signs' heights, and the ring of arrows around the terminal. */
const EXIT = { hallSignHeight: 3.4, doorSignHeight: 2.6, doorSignInset: 0.3, ringRadius: 2.6 };

/** The four wings around the hall and their turn; the one towards +x holds the airlock. */
const ARMS = [
  { turn: 0, plan: INDUSTRY_WING },
  { turn: QUARTER_TURN, plan: OPERATIONS_WING },
  { turn: 2 * QUARTER_TURN, plan: RESIDENTIAL_WING },
  { turn: -QUARTER_TURN, plan: SCIENCE_WING },
];

/** Returns the spot (m, from the hall's center) the given distance along an arm of the cross. */
const alongArm = (turn: number, distance: number) => ({
  x: distance * Math.sin(turn),
  z: distance * Math.cos(turn),
});

/** Returns both ways through a wing's door, outwards and back towards the hall. */
const passagesThrough = (turn: number, door: WingDoor): DoorPassage[] => {
  const at = WING_START + door.at;
  const hallSide = alongArm(turn, at - DOOR_STEP.inside);
  const farSide = alongArm(turn, at + (door.outer ? DOOR_STEP.outer : DOOR_STEP.outside));
  return [
    { from: hallSide, to: farSide, label: door.labels.outward, leavesBase: door.outer },
    { from: farSide, to: hallSide, label: door.labels.inward },
  ];
};

/** The crew quarters: the last room of the living wing, where the astronaut wakes up. */
const QUARTERS_ROOM = RESIDENTIAL_WING.zones.length - 1;
/** Facing back towards the hall: the living wing lies towards -z, and a heading of 0 looks along -z. */
const TOWARDS_HALL = Math.PI;

/** Returns the middle of the crew quarters' corridor (m, from the hall's center). */
const crewQuarters = () => {
  const before = RESIDENTIAL_WING.zones
    .slice(0, QUARTERS_ROOM)
    .reduce((sum, zone) => sum + zone.length, 0);
  const middle = before + RESIDENTIAL_WING.zones[QUARTERS_ROOM].length / 2;
  return { ...alongArm(2 * QUARTER_TURN, WING_START + middle), heading: TOWARDS_HALL };
};

/**
 * The way out of a wing: in the airlock wing, an EXIT sign above its doorway in the hall and one
 * above the outer door, with floor arrows from the hall to the outer door; in the other wings,
 * floor arrows back to the hall.
 */
const exitGuidance = (holdsAirlock: boolean, wingEnd: number) => {
  const guidance = new Group();
  if (!holdsAirlock) {
    guidance.add(arrowsAlong(wingEnd - 1, HUB.radius - 0.6));
    return guidance;
  }
  const hallExit = createExitSign();
  hallExit.position.set(0, EXIT.hallSignHeight, HALL_SIGN.radius);
  hallExit.rotation.y = Math.PI;
  const doorExit = createExitSign();
  doorExit.position.set(0, EXIT.doorSignHeight, wingEnd - EXIT.doorSignInset);
  doorExit.rotation.y = Math.PI;
  guidance.add(hallExit, doorExit, arrowsAlong(EXIT.ringRadius, wingEnd - 1));
  return guidance;
};

const hallSign = (text: string) => {
  const sign = createZoneSign(text);
  sign.position.set(0, HALL_SIGN.height, HALL_SIGN.radius);
  sign.rotation.y = Math.PI;
  return sign;
};

/**
 * Builds a cross-shaped habitat like the module clusters of NASA's Moon base concepts: the round
 * central hall (the control center) with four wings around it, each joined by a short corridor and
 * split into the rooms a crew of four lives and works in, the wing towards +x ending in the airlock,
 * the single way in and out. Returns it with its solid parts, and both ways through each closed door
 * (m, from the hall's center).
 */
export const createCrossHabitat = () => {
  const { hub, solids: hubSolids } = createHub();
  const habitat = new Group();
  const airlockTurn = ARMS.find(({ plan }) => plan.outerDoor)?.turn ?? QUARTER_TURN;
  habitat.add(hub, arrowsAround(EXIT.ringRadius, airlockTurn));
  const solids: Object3D[] = [...hubSolids];
  const passages: DoorPassage[] = [];
  for (const { turn, plan } of ARMS) {
    const { wing, solids: wingSolids, length, doors } = createWing(plan);
    wing.position.z = WING_START + length / 2;
    const { connector, solids: connectorSolids } = createConnector();
    const holder = new Group();
    holder.rotation.y = turn;
    holder.add(
      connector,
      wing,
      hallSign(plan.name),
      exitGuidance(plan.outerDoor !== undefined, WING_START + length),
    );
    habitat.add(holder);
    solids.push(...connectorSolids, ...wingSolids);
    passages.push(...doors.flatMap((door) => passagesThrough(turn, door)));
  }
  return { habitat, solids, passages, wakeUp: crewQuarters() };
};
