import { CylinderGeometry, ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, Shape } from 'three';
import { hullPlating } from '../habitat/hull-texture';
import { doorway, sideWindow, trimBand } from './module-details';
import { cornerLights, roofKit } from './module-fittings';

/** A module's outer size (m): across, up its walls, and along its length (z). */
export type ModuleSize = { width: number; height: number; length: number };
/** The cut of its upper edges, the cut of its lower edges, and the height of its feet (m). */
const EDGE = { top: 0.6, bottom: 0.15, feet: 0.45 };
/** One tile of hull plating covers this many meters. */
const PLATING_M = 2;

/** The module's cross-section: a box with its edges cut, like the base's poster shows. */
const section = ({ width, height }: ModuleSize) => {
  const [x, top, low] = [width / 2, EDGE.top, EDGE.bottom];
  return new Shape()
    .moveTo(-x + low, 0)
    .lineTo(x - low, 0)
    .lineTo(x, low)
    .lineTo(x, height - top)
    .lineTo(x - top, height)
    .lineTo(-x + top, height)
    .lineTo(-x, height - top)
    .lineTo(-x, low)
    .closePath();
};

const feet = ({ width, length }: ModuleSize) => {
  const steel = new MeshStandardMaterial({ color: 0x6b707a, metalness: 0.6, roughness: 0.4 });
  return [-1, 1].flatMap((x) =>
    [-1, 1].map((z) => {
      const leg = new Mesh(new CylinderGeometry(0.1, 0.18, EDGE.feet, 8), steel);
      leg.position.set(x * (width / 2 - 0.5), EDGE.feet / 2, z * (length / 2 - 0.6));
      return leg;
    }),
  );
};

/**
 * Builds a small white base module standing on four feet, as on the base's poster: plated walls
 * with cut edges, an orange band, a lit door with steps on its +z end, a window on each side, amber
 * marker lights and roof equipment.
 */
export const createSecondaryModule = (size: ModuleSize) => {
  const { width, height, length } = size;
  const plating = new MeshStandardMaterial({
    ...hullPlating(1 / PLATING_M, 1 / PLATING_M),
    bumpScale: 0.6,
    roughness: 0.6,
  });
  const body = new Mesh(
    new ExtrudeGeometry(section(size), { depth: length, bevelEnabled: false }),
    plating,
  );
  body.position.set(0, EDGE.feet, -length / 2);
  const entry = doorway(EDGE.feet);
  entry.position.z = length / 2 + 0.03;
  const band = trimBand(width, length, EDGE.feet + height - EDGE.top - 0.2);
  const module = new Group();
  module.add(body, entry, band, ...feet(size), ...roofKit(EDGE.feet + height, length));
  module.add(...cornerLights(width, length, EDGE.feet + 0.35));
  for (const side of [-1, 1]) {
    const window = sideWindow();
    window.position.set(side * (width / 2 + 0.02), EDGE.feet + height * 0.55, 0);
    window.rotation.y = side > 0 ? 0 : Math.PI;
    module.add(window);
  }
  module.traverse((part) => {
    part.castShadow = part instanceof Mesh;
    part.receiveShadow = part === body;
  });
  return module;
};
