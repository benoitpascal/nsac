import { ConeGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { DIG_ZONE } from '../base-layout';
import { createZoneGround } from './zone-ground.mesh';
import { ARM_LENGTH, DRUM } from './excavator-drum';
import { createExcavator, HINGE } from './excavator.mesh';

/** Patch dug where the robot starts (m). */
const DUG = { length: 3.4, width: 1.4 };
/** Slow raise and lower of the drums while digging: swing (radians) and period (s). */
const DIG_BOB = { swing: 0.1, period: 3 };
const PILE = { radius: 1.3, height: 0.9, x: 3.2 };
const DRUM_TURNS_PER_SECOND = 0.6;
/** Arm angle (radians) with the drums raised for driving. */
const RAISED_ARM_ANGLE = 0.2;
/** How high (m) the drums lift the chassis while digging, and how fast it rises (per second). */
const LIFT = { height: 0.3, rate: 2.5 };
const WHEEL_RADIUS = 0.28;
const TRACK = { color: 0x1f1f1f, opacity: 0.35 };
const PILE_COLOR = 0x7a746c;
const DIG_EDGE_COLOR = 0xd8d8d8;

/** What the robot is doing this frame: digging or not, and how far it rolled forward (m). */
export type ExcavatorActivity = { digging: boolean; rolled: number };

/** Moves and animates the robot of the dig site. */
export type ExcavatorControls = {
  /** Places the robot (m, from the site center) facing the heading (radians, 0 along -z). */
  place: (x: number, z: number, heading: number) => void;
  animate: (seconds: number, activity: ExcavatorActivity) => void;
};

/**
 * Builds the regolith dig site: a grey zone where digging is allowed, a dark dug patch, a pile of
 * dug regolith and an excavator robot.
 * To dig, the robot pushes its drums into the ground until its wheels leave it, then turns them
 * in opposite ways; to drive, it sets its wheels down and raises its drums. Returns it with its solid pile and the robot's controls.
 */
export const createExcavatorSite = () => {
  const { robot, wheels, arms, drums } = createExcavator();
  const track = new Mesh(
    new PlaneGeometry(DUG.length, DUG.width),
    new MeshStandardMaterial({ color: TRACK.color, transparent: true, opacity: TRACK.opacity }),
  );
  track.rotation.x = -Math.PI / 2;
  track.position.y = 0.01;
  const pile = new Mesh(
    new ConeGeometry(PILE.radius, PILE.height, 24),
    new MeshStandardMaterial({ color: PILE_COLOR, roughness: 1, flatShading: true }),
  );
  pile.position.set(PILE.x, PILE.height / 2, 0);
  const site = new Group();
  site.add(createZoneGround(DIG_ZONE, DIG_EDGE_COLOR), track, pile, robot);
  let elapsed = 0;
  let lift = 0;
  /** Arm angle putting the drums on the ground, with the chassis raised by the given height. */
  const groundAngle = (raised: number) => Math.asin((DRUM.radius - HINGE.y - raised) / ARM_LENGTH);
  const controls: ExcavatorControls = {
    // The robot's drums lie along its local x axis: turned so that x points where it heads.
    place: (x, z, heading) => {
      robot.position.set(x, 0, z);
      robot.rotation.y = heading + Math.PI / 2;
    },
    animate: (seconds, { digging, rolled }) => {
      elapsed += seconds;
      lift = Math.min(Math.max(lift + (digging ? 1 : -1) * LIFT.rate * seconds, 0), 1);
      const raised = lift * LIFT.height;
      robot.position.y = raised;
      const bob =
        lift === 1 ? Math.sin((elapsed / DIG_BOB.period) * Math.PI * 2) * DIG_BOB.swing : 0;
      const angle = RAISED_ARM_ANGLE + (groundAngle(raised) - RAISED_ARM_ANGLE) * lift + bob;
      for (const arm of arms) arm.rotation.z = angle;
      for (const wheel of wheels) wheel.rotation.y -= rolled / WHEEL_RADIUS;
      if (lift < 1) return;
      // The rear arm is mounted half a turn around, so the same local spin turns its drum the
      // opposite way to the front one, as the real drums do to cancel their digging forces.
      for (const drum of drums) drum.rotation.z -= DRUM_TURNS_PER_SECOND * Math.PI * 2 * seconds;
    },
  };
  return { site, solids: [pile], controls };
};
