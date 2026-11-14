import { MeshStandardMaterial } from 'three';
import type { WebGLRenderer } from 'three';
import { createReflections } from '@/modules/globe/ui/bodies/satellite/satellite.materials';

/** Surfaces of the spacesuit, the shiny ones reflecting a soft studio light. */
export type SuitMaterials = {
  fabric: MeshStandardMaterial;
  hard: MeshStandardMaterial;
  metal: MeshStandardMaterial;
  dark: MeshStandardMaterial;
  visor: MeshStandardMaterial;
  stripe: MeshStandardMaterial;
  patch: MeshStandardMaterial;
  lamp: MeshStandardMaterial;
};

/** Creates the spacesuit surfaces: off-white fabric, hard shells, metal rings and a gold visor. */
export const createSuitMaterials = (renderer: WebGLRenderer): SuitMaterials => {
  const envMap = createReflections(renderer);
  const shiny = { envMap, envMapIntensity: 0.6 };
  return {
    fabric: new MeshStandardMaterial({
      envMap,
      envMapIntensity: 0.5,
      color: 0xf1efea,
      roughness: 0.8,
    }),
    hard: new MeshStandardMaterial({ ...shiny, color: 0xf4f4f1, roughness: 0.45 }),
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
