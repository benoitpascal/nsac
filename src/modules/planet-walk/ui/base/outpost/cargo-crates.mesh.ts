import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

/** One crate (m), and the orange light on its front. */
const CRATE = { width: 1.6, height: 1.1, depth: 1.1, frame: 0.07 };
const AMBER = 0xff8a2a;

/** Where each crate of a stack sits (m), as columns side by side, some carrying a second crate. */
const STACK = [
  { x: -0.85, y: 0 },
  { x: 0.85, y: 0 },
  { x: -0.85, y: 1 },
];

const crate = (
  body: MeshStandardMaterial,
  frame: MeshStandardMaterial,
  glow: MeshStandardMaterial,
) => {
  const parts = new Group();
  parts.add(new Mesh(new BoxGeometry(CRATE.width, CRATE.height, CRATE.depth), body));
  for (const [x, y] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    const edge = new Mesh(new BoxGeometry(CRATE.frame, CRATE.frame, CRATE.depth + 0.02), frame);
    edge.position.set((x * CRATE.width) / 2, (y * CRATE.height) / 2, 0);
    parts.add(edge);
  }
  const rib = new Mesh(new BoxGeometry(0.05, CRATE.height, CRATE.depth + 0.02), frame);
  const light = new Mesh(new BoxGeometry(0.2, 0.06, 0.02), glow);
  light.position.set(CRATE.width / 2 - 0.25, CRATE.height / 2 - 0.15, CRATE.depth / 2 + 0.01);
  parts.add(rib, light);
  return parts;
};

/**
 * Builds a stack of grey supply crates with a small orange light each, as on the base's poster:
 * two side by side and one on top.
 */
export const createCrateStack = () => {
  const body = new MeshStandardMaterial({ color: 0xa9adb3, roughness: 0.75, metalness: 0.2 });
  const frame = new MeshStandardMaterial({ color: 0x6b707a, roughness: 0.6, metalness: 0.5 });
  const glow = new MeshStandardMaterial({ color: AMBER, emissive: AMBER, emissiveIntensity: 2 });
  const stack = new Group();
  for (const place of STACK) {
    const one = crate(body, frame, glow);
    one.position.set(place.x, CRATE.height / 2 + place.y * CRATE.height, 0);
    stack.add(one);
  }
  stack.traverse((part) => {
    part.castShadow = true;
    part.receiveShadow = true;
  });
  return stack;
};
