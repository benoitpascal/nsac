import { MeshStandardMaterial } from 'three';
import { suitCloth } from './suit-texture';
import type { WebGLRenderer } from 'three';
import { createReflections } from '@/modules/globe/ui/bodies/satellite/satellite.materials';

/** Surfaces of the spacesuit, the shiny ones reflecting a soft studio light. */
export type SuitMaterials = {
  fabric: MeshStandardMaterial;
  dusty: MeshStandardMaterial;
  boot: MeshStandardMaterial;
  hard: MeshStandardMaterial;
  metal: MeshStandardMaterial;
  dark: MeshStandardMaterial;
  visor: MeshStandardMaterial;
  stripe: MeshStandardMaterial;
  patch: MeshStandardMaterial;
  lamp: MeshStandardMaterial;
};

/**
 * Creates the spacesuit surfaces: woven off-white cloth (dusty on the legs), hard shells, boots,
 * metal rings and a gold visor.
 */
export const createSuitMaterials = (renderer: WebGLRenderer): SuitMaterials => {
  const envMap = createReflections(renderer);
  const shiny = { envMap, envMapIntensity: 0.6 };
  const cloth = { envMap, envMapIntensity: 0.35, roughness: 0.95, bumpScale: 2, color: 0xdcdad3 };
  return {
    fabric: new MeshStandardMaterial({ ...cloth, ...suitCloth(false) }),
    dusty: new MeshStandardMaterial({ ...cloth, ...suitCloth(true) }),
    boot: new MeshStandardMaterial({ color: 0xc9c7c0, roughness: 0.85 }),
    hard: new MeshStandardMaterial({ ...shiny, color: 0xe2e0da, roughness: 0.6 }),
    metal: new MeshStandardMaterial({ ...shiny, color: 0xaab2bd, metalness: 0.8, roughness: 0.3 }),
    dark: new MeshStandardMaterial({ color: 0x3e434d, roughness: 0.7 }),
    visor: new MeshStandardMaterial({
      ...shiny,
      color: 0xd9a441,
      metalness: 1,
      roughness: 0.08,
      envMapIntensity: 1.4,
    }),
    stripe: new MeshStandardMaterial({ color: 0xc8323a, roughness: 0.8 }),
    patch: new MeshStandardMaterial({ color: 0x2f5fb3, roughness: 0.7 }),
    lamp: new MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xfff4d6, emissiveIntensity: 1.5 }),
  };
};
