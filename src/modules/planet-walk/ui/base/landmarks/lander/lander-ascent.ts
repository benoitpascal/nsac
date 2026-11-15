import {
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'three';
import { antenna, thrusters } from './lander-fittings';
import { cabinPanels } from './panel-texture';
import type { Texture } from 'three';

/** The crew cabin (m): a faceted body narrowing to its roof, then a smaller top. */
const CABIN = { bottom: 2.1, waist: 1.8, height: 2.3, top: 1.05, topHeight: 0.8 };

const facets = (bottom: number, top: number, height: number, material: MeshStandardMaterial) =>
  new Mesh(new CylinderGeometry(top, bottom, height, 8, 1, false, Math.PI / 8), material);

/**
 * Builds the lander's crew cabin, as in the game's intro: faceted walls in a patchwork of silver
 * and grey panels, dark windows and a hatch at the front (-z), thruster blocks at the corners and a
 * dish on the roof. Its floor stands at the origin.
 */
export const createAscentStage = (envMap: Texture | null) => {
  const skin = new MeshStandardMaterial({
    ...cabinPanels(3, 1),
    envMap,
    envMapIntensity: 0.5,
    metalness: 0.55,
    roughness: 0.4,
    bumpScale: 1,
  });
  const metal = new MeshStandardMaterial({
    envMap,
    color: 0xb8bec9,
    metalness: 1,
    roughness: 0.35,
    side: DoubleSide,
  });
  const dark = new MeshStandardMaterial({ color: 0x1d1f24, metalness: 0.4, roughness: 0.3 });
  const body = facets(CABIN.bottom, CABIN.waist, CABIN.height, skin);
  body.position.y = CABIN.height / 2;
  const roof = facets(CABIN.waist, CABIN.top, CABIN.topHeight, skin);
  roof.position.y = CABIN.height + CABIN.topHeight / 2;
  const cabin = new Group();
  cabin.add(body, roof, ...antenna(metal, CABIN.height + CABIN.topHeight));
  for (const side of [-1, 1]) {
    const window = new Mesh(new BoxGeometry(0.45, 0.4, 0.05), dark);
    window.position.set(side * 0.45, CABIN.height * 0.72, -1.76);
    window.rotation.x = 0.13;
    cabin.add(window);
  }
  const hatch = new Mesh(new BoxGeometry(0.8, 0.8, 0.05), dark);
  hatch.position.set(0, 0.6, -1.89);
  cabin.add(hatch);
  for (let index = 0; index < 4; index++) {
    const angle = Math.PI / 4 + (index * Math.PI) / 2;
    const block = thrusters(dark, metal);
    block.position.set(Math.cos(angle) * 2, CABIN.height * 0.8, Math.sin(angle) * 2);
    block.rotation.y = -angle;
    cabin.add(block);
  }
  cabin.traverse((part) => {
    part.castShadow = true;
  });
  return cabin;
};
