import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';
import { strut } from './strut';

const SHELL = { radius: 3.5, flattening: 0.55, color: 0xe9e6df };
const COLUMN = { radius: 0.9, height: 2.6 };
const LEG = { spread: 4.2, radius: 0.12, count: 4 };
const METAL = 0xb8bec9;
const BAND = 0xc9c4b8;
const BELT_RADII = [0.82, 0.98];

/**
 * An inflatable habitat raised on a lander's legs, like NASA's Mars surface habitat concepts:
 * a soft, flattened shell with seams, on a central column and four splayed legs.
 */
export const createInflatableHabitat = () => {
  const metal = new MeshStandardMaterial({ color: METAL, metalness: 0.7, roughness: 0.4 });
  const fabric = new MeshStandardMaterial({ color: SHELL.color, roughness: 0.85 });
  const shellHeight = COLUMN.height + SHELL.radius * SHELL.flattening;
  const shell = new Mesh(new SphereGeometry(SHELL.radius, 40, 24), fabric);
  shell.scale.y = SHELL.flattening;
  shell.position.y = shellHeight;
  const column = new Mesh(
    new CylinderGeometry(COLUMN.radius, COLUMN.radius * 1.2, COLUMN.height, 24),
    metal,
  );
  column.position.y = COLUMN.height / 2;
  const habitat = new Group();
  habitat.add(shell, column);
  for (const share of BELT_RADII) {
    const height = SHELL.flattening * SHELL.radius * Math.sqrt(1 - share * share);
    for (const side of [-1, 1]) {
      const belt = new Mesh(
        new TorusGeometry(SHELL.radius * share, 0.07, 8, 48),
        new MeshStandardMaterial({ color: BAND }),
      );
      belt.rotation.x = Math.PI / 2;
      belt.position.y = shellHeight + side * height;
      habitat.add(belt);
    }
  }
  for (let index = 0; index < LEG.count; index++) {
    const angle = (index / LEG.count) * Math.PI * 2 + Math.PI / 4;
    const foot = new Vector3(Math.cos(angle) * LEG.spread, 0, Math.sin(angle) * LEG.spread);
    const hip = new Vector3(
      Math.cos(angle) * COLUMN.radius,
      COLUMN.height,
      Math.sin(angle) * COLUMN.radius,
    );
    habitat.add(strut(hip, foot, LEG.radius, metal));
  }
  return habitat;
};
