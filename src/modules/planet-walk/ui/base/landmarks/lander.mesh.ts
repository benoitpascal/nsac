import { Group, MeshStandardMaterial } from 'three';
import { createAscentStage } from './lander/lander-ascent';
import { createDescentStage, DESCENT } from './lander/lander-descent';
import type { SatelliteMaterials } from '@/modules/globe/ui/bodies/satellite/satellite.materials';

/**
 * A crew lander standing on its four legs, as in the game's intro: a descent stage wrapped in gold
 * foil carrying the engines and legs, and the crew cabin on top in silver and grey panels. It
 * reflects the same soft studio light as the base's other spacecraft.
 */
export const createLander = (materials: SatelliteMaterials) => {
  const envMap = materials.foil instanceof MeshStandardMaterial ? materials.foil.envMap : null;
  const cabin = createAscentStage(envMap);
  cabin.position.y = DESCENT.lift + DESCENT.height;
  const lander = new Group();
  lander.add(createDescentStage(envMap), cabin);
  return lander;
};
