import { Group, LatheGeometry, Mesh, Vector2 } from 'three';
import { createHelmet } from './suit-helmet';
import { ring, roundedBox, sphere } from './suit-shapes';
import type { SuitMaterials } from './astronaut-materials';
import type { Material } from 'three';

/** Outline of the pressurized torso from the waist up to the neck (radius, height in m). */
const TORSO_OUTLINE: [number, number][] = [
  [0, 0.9],
  [0.18, 0.9],
  [0.2, 0.98],
  [0.23, 1.14],
  [0.255, 1.3],
  [0.245, 1.43],
  [0.17, 1.53],
  [0, 1.54],
];
/** The padded upper torso, over the chest and shoulders from this height up (m). */
const HARD_FROM = 1.12;

const lathe = (outline: [number, number][], grow: number, material: Material) => {
  const points = outline.map(([radius, height]) => new Vector2(radius * grow, height));
  const mesh = new Mesh(new LatheGeometry(points, 32), material);
  mesh.scale.set(1.12, 1, 0.82);
  mesh.castShadow = true;
  return mesh;
};

/** The cloth torso, and the stiffer padded layer over its chest and shoulders. */
const torso = (suit: SuitMaterials) => {
  const upper = TORSO_OUTLINE.filter(([, height]) => height >= HARD_FROM);
  return [
    lathe(TORSO_OUTLINE, 1, suit.fabric),
    lathe([[0, HARD_FROM], ...upper], 1.04, suit.fabric),
  ];
};

/**
 * The chest control unit at the front: a box with a display and three coloured knobs, and the red
 * and blue hose connectors below it, as on the Apollo suits.
 */
const chestUnit = (suit: SuitMaterials) => {
  const unit = new Group();
  unit.add(roundedBox([0.28, 0.14, 0.1], 0.025, [0, 1.2, -0.245], suit.hard));
  unit.add(roundedBox([0.12, 0.06, 0.01], 0.004, [-0.05, 1.21, -0.296], suit.dark));
  [suit.stripe, suit.patch, suit.lamp].forEach((material, index) =>
    unit.add(sphere(0.014, [0.06 + index * 0.03, 1.2, -0.296], material)),
  );
  [suit.stripe, suit.patch, suit.stripe, suit.patch].forEach((material, index) =>
    unit.add(ring(0.028, 0.012, [(index - 1.5) * 0.08, 1.07, -0.24], material)),
  );
  return unit;
};

/** The life-support backpack: a tall white case with its oxygen pack on top and side boxes. */
const backpack = (suit: SuitMaterials) => [
  roundedBox([0.5, 0.62, 0.26], 0.07, [0, 1.22, 0.29], suit.fabric),
  roundedBox([0.46, 0.26, 0.24], 0.06, [0, 1.68, 0.3], suit.fabric),
  roundedBox([0.47, 0.03, 0.25], 0.01, [0, 1.54, 0.3], suit.dark),
  roundedBox([0.07, 0.4, 0.18], 0.025, [-0.27, 1.2, 0.29], suit.boot),
  roundedBox([0.07, 0.4, 0.18], 0.025, [0.27, 1.2, 0.29], suit.boot),
  roundedBox([0.3, 0.12, 0.03], 0.01, [0, 1.38, 0.43], suit.boot),
];

/**
 * Builds the astronaut's body without limbs: cloth torso under a padded upper layer, waist ring,
 * helmet, life-support backpack, chest unit and shoulder bearings.
 */
export const createSuitBody = (suit: SuitMaterials) => {
  const body = new Group();
  body.add(...torso(suit), ring(0.2, 0.028, [0, 0.98, 0], suit.metal), createHelmet(suit));
  body.add(chestUnit(suit), ...backpack(suit));
  for (const side of [-1, 1]) {
    body.add(sphere(0.1, [side * 0.29, 1.42, 0], suit.fabric));
    body.add(ring(0.1, 0.018, [side * 0.31, 1.36, 0], suit.metal));
  }
  return body;
};
