import { Group, Mesh, MeshStandardMaterial } from 'three';
import { farGeometry, nearGeometry } from './ground-geometry';
import { drawRegolith } from './ground-texture';
import type { WorldAppearance } from '../world-appearance';

/**
 * Creates the ground, built once for every world: flat dusty plains to walk on, then hills up to
 * the horizon. Only its tint changes from one world to another.
 */
export const createGround = () => {
  const { map, bumpMap } = drawRegolith(1);
  const material = new MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 1.5,
    vertexColors: true,
    roughness: 1,
  });
  const near = new Mesh(nearGeometry(), material);
  const far = new Mesh(farGeometry(), material);
  near.receiveShadow = true;
  far.receiveShadow = true;
  const ground = new Group();
  ground.add(near, far);
  return {
    ground,
    /** Tints the ground with the world's soil color. */
    paint: (appearance: WorldAppearance) => material.color.set(appearance.ground[0]),
  };
};
