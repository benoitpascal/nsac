import { Group, LatheGeometry, Mesh, SphereGeometry, Vector2 } from 'three';
import { ring, roundedBox, sphere } from './suit-shapes';
import type { SuitMaterials } from './astronaut-materials';

/** Outline of the pressurized torso from the waist up to the neck (radius, height in m). */
const TORSO_OUTLINE: [number, number][] = [
  [0, 0.9],
  [0.17, 0.9],
  [0.19, 0.98],
  [0.22, 1.14],
  [0.245, 1.3],
  [0.235, 1.43],
  [0.17, 1.52],
  [0, 1.53],
];
const HELMET = { radius: 0.175, height: 1.69 };
const VISOR = { width: 2.3, height: 1.5, lift: 0.1 };

const torso = (suit: SuitMaterials) => {
  const points = TORSO_OUTLINE.map(([radius, height]) => new Vector2(radius, height));
  const mesh = new Mesh(new LatheGeometry(points, 32), suit.fabric);
  mesh.scale.set(1.12, 1, 0.82);
  mesh.castShadow = true;
  return mesh;
};

const visor = (suit: SuitMaterials) => {
  const geometry = new SphereGeometry(
    HELMET.radius * 1.025,
    32,
    20,
    (3 * Math.PI) / 2 - VISOR.width / 2,
    VISOR.width,
    Math.PI / 2 - VISOR.height / 2 + VISOR.lift,
    VISOR.height,
  );
  const mesh = new Mesh(geometry, suit.visor);
  mesh.position.y = HELMET.height;
  return mesh;
};

/** The helmet: hard white shell, gold visor at the front, a lamp on each side. */
const helmet = (suit: SuitMaterials) => {
  const head = new Group();
  head.add(
    sphere(HELMET.radius, [0, HELMET.height, 0], suit.hard),
    visor(suit),
    ring(0.125, 0.03, [0, 1.545, 0], suit.metal),
  );
  for (const side of [-1, 1]) {
    head.add(roundedBox([0.05, 0.05, 0.08], 0.015, [side * 0.18, 1.75, -0.04], suit.hard));
    head.add(sphere(0.016, [side * 0.18, 1.75, -0.085], suit.lamp));
  }
  return head;
};

/** The chest control unit at the front: a box with three coloured buttons. */
const chestUnit = (suit: SuitMaterials) => {
  const unit = new Group();
  unit.add(roundedBox([0.26, 0.13, 0.09], 0.025, [0, 1.2, -0.235], suit.hard));
  [suit.stripe, suit.patch, suit.lamp].forEach((material, index) =>
    unit.add(sphere(0.014, [(index - 1) * 0.06, 1.2, -0.282], material)),
  );
  return unit;
};

/**
 * Builds the astronaut's body without limbs: torso, waist ring, helmet, life-support backpack,
 * chest unit and shoulder joints with a blue mission patch.
 */
export const createSuitBody = (suit: SuitMaterials) => {
  const body = new Group();
  body.add(torso(suit), ring(0.19, 0.025, [0, 0.97, 0], suit.metal), helmet(suit), chestUnit(suit));
  body.add(roundedBox([0.46, 0.6, 0.22], 0.06, [0, 1.25, 0.27], suit.hard));
  body.add(roundedBox([0.4, 0.06, 0.18], 0.02, [0, 1.57, 0.27], suit.dark));
  for (const side of [-1, 1]) body.add(sphere(0.095, [side * 0.29, 1.42, 0], suit.fabric));
  body.add(sphere(0.035, [-0.37, 1.33, 0], suit.patch));
  return body;
};
