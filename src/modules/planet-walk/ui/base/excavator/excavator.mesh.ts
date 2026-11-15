import { CylinderGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createDrumArm } from './excavator-drum';

const CHASSIS = { length: 1.3, height: 0.45, width: 0.8, lift: 0.55 };
const WHEEL = { radius: 0.28, width: 0.18, x: 0.45, z: 0.5 };
/** Where the drum arms are hinged on the chassis (m). */
export const HINGE = { x: 0.62, y: 0.6 };
const MAST = { height: 0.5, radius: 0.03 };

const material = (color: number, roughness = 0.6, metalness = 0.2) =>
  new MeshStandardMaterial({ color, roughness, metalness });

/**
 * Builds a regolith excavator robot like NASA's RASSOR and IPEx: a low chassis on four wheels
 * with a bucket drum on an arm at each end (along x), and a camera mast. Returns it with its
 * wheels (spinning around z), arms (raised or lowered around z) and drums.
 */
export const createExcavator = () => {
  const [body, frame, dark, scoop] = [
    material(0xe4e6ea),
    material(0x9aa1ad, 0.4, 0.7),
    material(0x2f333b, 0.8),
    material(0xd9a441, 0.5, 0.4),
  ];
  const chassis = new Mesh(
    new RoundedBoxGeometry(CHASSIS.length, CHASSIS.height, CHASSIS.width, 3, 0.08),
    body,
  );
  chassis.position.y = CHASSIS.lift;
  const robot = new Group();
  robot.add(chassis);
  const wheels = [-1, 1].flatMap((x) =>
    [-1, 1].map((z) => {
      const wheel = new Mesh(
        new CylinderGeometry(WHEEL.radius, WHEEL.radius, WHEEL.width, 20),
        dark,
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x * WHEEL.x, WHEEL.radius, z * WHEEL.z);
      robot.add(wheel);
      return wheel;
    }),
  );
  const ends = [1, -1].map((side) => {
    const { arm, drum } = createDrumArm(frame, dark, scoop);
    const hinge = new Group();
    hinge.position.set(side * HINGE.x, HINGE.y, 0);
    hinge.rotation.y = side === 1 ? 0 : Math.PI;
    hinge.add(arm);
    robot.add(hinge);
    return { arm, drum };
  });
  const mast = new Mesh(new CylinderGeometry(MAST.radius, MAST.radius, MAST.height, 8), frame);
  mast.position.set(-0.3, CHASSIS.lift + CHASSIS.height / 2 + MAST.height / 2, 0);
  const camera = new Mesh(new RoundedBoxGeometry(0.16, 0.1, 0.22, 2, 0.03), dark);
  camera.position.set(-0.3, mast.position.y + MAST.height / 2 + 0.05, 0);
  robot.add(mast, camera);
  return { robot, wheels, arms: ends.map((end) => end.arm), drums: ends.map((end) => end.drum) };
};
