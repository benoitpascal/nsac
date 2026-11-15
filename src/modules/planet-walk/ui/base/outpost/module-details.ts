import { BoxGeometry, Group, Mesh, MeshStandardMaterial, PointLight } from 'three';

const TRIM_COLOR = 0xe0862a;
const DARK = 0x4a4f58;
const AMBER = 0xffa040;
const WINDOW_GLOW = 0xffd28a;
const DOOR = { width: 1, height: 2, frame: 0.1 };
const STEP = { rise: 0.15, run: 0.3, width: 1.2 };
/** The warm lamp over the door, seen from afar at night (candela, m). */
const DOOR_LAMP = { intensity: 8, reach: 7 };

const box = (width: number, height: number, depth: number, material: MeshStandardMaterial) =>
  new Mesh(new BoxGeometry(width, height, depth), material);

const glowing = (color: number, glow: number) =>
  new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: glow });

/** An orange band around the module's walls at the given height (m), as on the base's poster. */
export const trimBand = (width: number, length: number, height: number) => {
  const orange = new MeshStandardMaterial({ color: TRIM_COLOR, roughness: 0.6 });
  const band = new Group();
  for (const side of [-1, 1]) {
    const long = box(0.03, 0.18, length, orange);
    long.position.set(side * (width / 2 + 0.015), height, 0);
    const across = box(width, 0.18, 0.03, orange);
    across.position.set(0, height, side * (length / 2 + 0.015));
    band.add(long, across);
  }
  return band;
};

/** A dark door with its orange frame, an amber lamp above, and steps down to the ground. */
export const doorway = (floor: number) => {
  const orange = new MeshStandardMaterial({ color: TRIM_COLOR, roughness: 0.6 });
  const door = box(DOOR.width, DOOR.height, 0.06, new MeshStandardMaterial({ color: DARK }));
  door.position.y = floor + DOOR.height / 2;
  const lintel = box(DOOR.width + 2 * DOOR.frame, DOOR.frame, 0.1, orange);
  lintel.position.y = floor + DOOR.height + DOOR.frame / 2;
  const entry = new Group();
  entry.add(door, lintel);
  for (const side of [-1, 1]) {
    const post = box(DOOR.frame, DOOR.height, 0.1, orange);
    post.position.set(side * (DOOR.width / 2 + DOOR.frame / 2), floor + DOOR.height / 2, 0);
    entry.add(post);
  }
  const lamp = box(1.2, 0.1, 0.08, glowing(AMBER, 2.5));
  lamp.position.y = floor + DOOR.height + 0.35;
  const light = new PointLight(AMBER, DOOR_LAMP.intensity, DOOR_LAMP.reach);
  light.position.set(0, lamp.position.y, 0.6);
  light.userData.nightLamp = DOOR_LAMP.intensity;
  entry.add(lamp, light);
  const metal = new MeshStandardMaterial({ color: DARK, metalness: 0.5, roughness: 0.5 });
  const steps = Math.ceil(floor / STEP.rise);
  for (let index = 0; index < steps; index++) {
    const step = box(STEP.width, STEP.rise, STEP.run, metal);
    step.position.set(0, floor - (index + 0.5) * STEP.rise, (index + 0.5) * STEP.run + 0.05);
    entry.add(step);
  }
  return entry;
};

/** A square window glowing warm from inside, facing +x. */
export const sideWindow = () => {
  const pane = box(0.04, 0.6, 0.9, glowing(WINDOW_GLOW, 1.2));
  const frame = box(0.03, 0.75, 1.05, new MeshStandardMaterial({ color: DARK }));
  frame.position.x = -0.01;
  const window = new Group();
  window.add(frame, pane);
  return window;
};
