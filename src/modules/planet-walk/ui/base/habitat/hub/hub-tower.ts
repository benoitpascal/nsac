import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { createEarthDish } from '../../dish.mesh';
import { createLatticeMast } from '../../lattice-mast.mesh';
import { hullPlating } from '../hull-texture';
import { HUB, STOREY } from './hub-blocks';
import { HUB_CORNER, HUB_SIDE } from './hub-wall';

const SIDES = 8;
/** Turns the octagon so that its flat sides face the modules. */
const FLAT_SIDES = Math.PI / SIDES;
const TRIM_COLOR = 0xe0862a;
const LIGHT = { color: 0xffa040, glow: 2, width: 1.4, height: 0.12 };
const MAST_HEIGHT = 7;

const prism = (bottom: number, top: number, height: number, material: MeshStandardMaterial) =>
  new Mesh(new CylinderGeometry(top, bottom, height, SIDES, 1, false, FLAT_SIDES), material);

/** Amber light bars high on every other side of the storey. */
const lightBars = (height: number) => {
  const glow = new MeshStandardMaterial({
    color: LIGHT.color,
    emissive: LIGHT.color,
    emissiveIntensity: LIGHT.glow,
  });
  return Array.from({ length: SIDES / 2 }, (_, index) => {
    const angle = (index * 2 + 1) * 2 * FLAT_SIDES;
    const bar = new Mesh(new BoxGeometry(LIGHT.width, LIGHT.height, 0.05), glow);
    const out = HUB.radius + 0.03;
    bar.position.set(Math.sin(angle) * out, height, Math.cos(angle) * out);
    bar.rotation.y = angle;
    return bar;
  });
};

/**
 * Builds the upper storey crowning the hall, as on the base's poster: plated walls, an orange trim,
 * a sloping top with amber lights, a radio dish pointed at the Earth and a lattice mast with its
 * beacon. It is only seen from outside, standing on the hall's roof.
 */
export const createHubTower = () => {
  const plating = new MeshStandardMaterial({
    ...hullPlating(SIDES, STOREY.height / 2),
    bumpScale: 0.6,
    roughness: 0.6,
  });
  const base = HUB.height + HUB.roof;
  const walls = prism(HUB_CORNER, HUB_CORNER, STOREY.height, plating);
  walls.position.y = base + STOREY.height / 2;
  const trim = prism(
    HUB_CORNER + 0.04,
    HUB_CORNER + 0.04,
    STOREY.trim,
    new MeshStandardMaterial({ color: TRIM_COLOR, roughness: 0.6 }),
  );
  trim.position.y = base + STOREY.height - STOREY.trim / 2;
  const cap = prism(HUB_CORNER, HUB_CORNER * STOREY.capShrink, STOREY.cap, plating);
  cap.position.y = base + STOREY.height + STOREY.cap / 2;
  const top = base + STOREY.height + STOREY.cap;
  const dish = createEarthDish();
  dish.position.set(-HUB_SIDE * 0.35, top, HUB_SIDE * 0.35);
  const mast = createLatticeMast(MAST_HEIGHT);
  mast.position.set(HUB_SIDE * 0.45, top, -HUB_SIDE * 0.4);
  const tower = new Group();
  tower.add(walls, trim, cap, dish, mast, ...lightBars(base + STOREY.height - STOREY.trim - 0.25));
  for (const part of [walls, trim, cap]) part.castShadow = true;
  return tower;
};
