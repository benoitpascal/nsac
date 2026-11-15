import { Group, Mesh, SphereGeometry } from 'three';
import { ring, roundedBox, sphere } from './suit-shapes';
import type { SuitMaterials } from './astronaut-materials';

const HELMET = { radius: 0.19, height: 1.7 };
/** The gold sun visor's opening (radians): its width, its height and how far it is raised. */
const VISOR = { width: 2.3, height: 1.55, lift: 0.05 };

/** A part of a sphere around the helmet's center, covering the given angles (radians). */
const shell = (
  radius: number,
  around: [number, number],
  down: [number, number],
  material: SuitMaterials[keyof SuitMaterials],
) => {
  const geometry = new SphereGeometry(radius, 36, 20, around[0], around[1], down[0], down[1]);
  const mesh = new Mesh(geometry, material);
  mesh.position.y = HELMET.height;
  mesh.castShadow = true;
  return mesh;
};

/**
 * The helmet: a bubble whose white visor assembly covers the back and the top, a big gold sun
 * visor hiding the face, a lamp block on each side, and the neck ring.
 */
export const createHelmet = (suit: SuitMaterials) => {
  const front = (3 * Math.PI) / 2;
  const head = new Group();
  head.add(
    sphere(HELMET.radius, [0, HELMET.height, 0], suit.dark),
    shell(
      HELMET.radius * 1.03,
      [front - VISOR.width / 2, VISOR.width],
      [Math.PI / 2 - VISOR.height / 2 + VISOR.lift, VISOR.height],
      suit.visor,
    ),
    shell(
      HELMET.radius * 1.06,
      [front + VISOR.width / 2, 2 * Math.PI - VISOR.width],
      [0, 2],
      suit.hard,
    ),
    shell(
      HELMET.radius * 1.06,
      [0, 2 * Math.PI],
      [0, Math.PI / 2 - VISOR.height / 2 + VISOR.lift + 0.02],
      suit.hard,
    ),
    ring(0.15, 0.035, [0, 1.535, 0], suit.metal),
  );
  for (const side of [-1, 1]) {
    head.add(roundedBox([0.06, 0.07, 0.11], 0.02, [side * 0.2, 1.76, -0.03], suit.hard));
    head.add(sphere(0.02, [side * 0.2, 1.76, -0.09], suit.lamp));
  }
  return head;
};
