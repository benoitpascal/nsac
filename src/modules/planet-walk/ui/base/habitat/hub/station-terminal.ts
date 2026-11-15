import { BoxGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { blockMesh } from '../habitat-dimensions';
import { HUB_CONSOLE } from './hub-blocks';
import { HALL_NAME } from '../zones/wing-signs';
import { createZoneSign } from '../zones/zone-sign';

const DESK_COLOR = 0x8a9099;
const CASING_COLOR = 0x2a2f38;
const SCREEN_GLOW = 0x4de3ff;
/**
 * A screen on each side of the desk (m): its size, how far back it leans, its lift above the desk
 * and how far in from the desk's edge it stands; narrow enough for the four screens and their
 * casings to clear each other at the corners even once leaning back.
 */
const SCREEN = { width: 0.8, height: 0.5, tilt: 0.35, lift: 0.35, inset: 0.12 };
const CASING_DEPTH = 0.06;
const QUARTER_TURN = Math.PI / 2;
/** The control center's name, shown on each side of a sign hanging above the screens (m). */
const NAME_SIGN = { height: 3.2, distance: 0.85 };

/** A glowing screen in its dark casing, leaning back, facing +z. */
const screenOnSide = (glow: MeshStandardMaterial, casing: MeshStandardMaterial) => {
  const screen = new Mesh(new PlaneGeometry(SCREEN.width, SCREEN.height), glow);
  const back = new Mesh(
    new BoxGeometry(SCREEN.width + 0.08, SCREEN.height + 0.08, CASING_DEPTH),
    casing,
  );
  back.position.z = -CASING_DEPTH / 2 - 0.005;
  const tilted = new Group();
  tilted.add(screen, back);
  tilted.rotation.x = -SCREEN.tilt;
  tilted.position.set(0, HUB_CONSOLE.height + SCREEN.lift, HUB_CONSOLE.size / 2 - SCREEN.inset);
  return tilted;
};

/**
 * Builds the station terminal in the middle of the hall: a desk with a glowing screen facing each
 * doorway, where the station dashboard is read, under the control center's name.
 */
export const createStationTerminal = () => {
  const desk = blockMesh(
    {
      x: 0,
      z: 0,
      width: HUB_CONSOLE.size,
      depth: HUB_CONSOLE.size,
      bottom: 0,
      top: HUB_CONSOLE.height,
    },
    new MeshStandardMaterial({ color: DESK_COLOR, roughness: 0.6 }),
  );
  const glow = new MeshStandardMaterial({
    color: SCREEN_GLOW,
    emissive: SCREEN_GLOW,
    emissiveIntensity: 1.4,
  });
  const casing = new MeshStandardMaterial({ color: CASING_COLOR, roughness: 0.5 });
  const terminal = new Group();
  terminal.add(desk);
  for (let side = 0; side < 4; side += 1) {
    const holder = new Group();
    holder.rotation.y = side * QUARTER_TURN;
    const name = createZoneSign(HALL_NAME);
    name.position.set(0, NAME_SIGN.height, NAME_SIGN.distance);
    holder.add(screenOnSide(glow, casing), name);
    terminal.add(holder);
  }
  return terminal;
};
