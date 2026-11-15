import { CylinderGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { crinkledFoil } from './foil-texture';
import { strut } from '../strut';
import type { Texture } from 'three';

/** The descent stage (m): an octagonal box wrapped in gold foil, raised on its legs. */
export const DESCENT = { radius: 2.3, height: 1.9, lift: 1.5 };
const LEG = { spread: 4.9, radius: 0.09, pad: 0.5, knee: 0.4 };
const ENGINE = { radius: 0.42, height: 0.7, ring: 0.8 };
const GOLD = 0xd9a441;
const BRASS = 0xc9a04e;

/** A leg reaching out from a corner of the stage, braced from below, ending on a round footpad. */
const leg = (angle: number, metal: MeshStandardMaterial) => {
  const out = (radius: number, height: number, turn = 0) =>
    new Vector3(Math.cos(angle + turn) * radius, height, Math.sin(angle + turn) * radius);
  const foot = out(LEG.spread, LEG.pad * 0.3);
  const top = out(DESCENT.radius, DESCENT.lift + DESCENT.height - 0.2);
  const knee = top.clone().lerp(foot, 1 - LEG.knee);
  const parts = [strut(top, foot, LEG.radius, metal)];
  for (const turn of [-0.35, 0.35]) {
    parts.push(
      strut(out(DESCENT.radius * 0.95, DESCENT.lift, turn), knee, LEG.radius * 0.6, metal),
    );
  }
  const pad = new Mesh(new CylinderGeometry(LEG.pad, LEG.pad * 0.8, 0.14, 20), metal);
  pad.position.copy(foot);
  parts.push(pad);
  return parts;
};

/**
 * Builds the lander's descent stage, as in the game's intro: an octagonal box in crinkled gold foil,
 * four splayed legs with braces and footpads, and its engine bells underneath.
 */
export const createDescentStage = (envMap: Texture | null) => {
  const foil = new MeshStandardMaterial({
    ...crinkledFoil(GOLD, 4, 1),
    envMap,
    envMapIntensity: 0.6,
    metalness: 0.85,
    roughness: 0.35,
    bumpScale: 2,
  });
  const metal = new MeshStandardMaterial({ envMap, color: BRASS, metalness: 1, roughness: 0.3 });
  const dark = new MeshStandardMaterial({
    color: 0x2b2d33,
    metalness: 0.6,
    roughness: 0.5,
    side: DoubleSide,
  });
  const box = new Mesh(
    new CylinderGeometry(DESCENT.radius, DESCENT.radius, DESCENT.height, 8, 1, false, Math.PI / 8),
    foil,
  );
  box.position.y = DESCENT.lift + DESCENT.height / 2;
  const stage = new Group();
  stage.add(box);
  for (let index = 0; index < 4; index++) {
    stage.add(...leg(Math.PI / 4 + (index * Math.PI) / 2, metal));
    const angle = (index * Math.PI) / 2;
    const bell = new Mesh(
      new CylinderGeometry(ENGINE.radius * 0.5, ENGINE.radius, ENGINE.height, 20, 1, true),
      dark,
    );
    bell.position.set(
      Math.cos(angle) * ENGINE.ring,
      DESCENT.lift - ENGINE.height / 2,
      Math.sin(angle) * ENGINE.ring,
    );
    stage.add(bell);
  }
  stage.traverse((part) => {
    part.castShadow = true;
  });
  return stage;
};
