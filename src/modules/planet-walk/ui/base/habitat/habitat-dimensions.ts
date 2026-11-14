import { BoxGeometry, Mesh } from 'three';
import type { Material } from 'three';

/** A block of the habitat (m, from the habitat center), from its bottom to its top. */
export type HabitatBlock = {
  x: number;
  z: number;
  width: number;
  depth: number;
  bottom: number;
  top: number;
};

/**
 * Habitat module: a cylinder lying along z, its hatch facing +z, its axis raised so that the
 * inside floor is the ground (m); each module has its own length.
 */
export const MODULE = { radius: 2.4, axisHeight: 1.9 };
/** Which ends of a module (along +z and -z) have a hatch; the others are closed. */
export type ModuleEnds = { front: boolean; back: boolean };

/** Hatch through a module end (m). */
export const HATCH = { width: 1.3, height: 2.1 };

/** Builds the block as a box mesh. */
export const blockMesh = (block: HabitatBlock, material: Material) => {
  const mesh = new Mesh(
    new BoxGeometry(block.width, block.top - block.bottom, block.depth),
    material,
  );
  mesh.position.set(block.x, (block.bottom + block.top) / 2, block.z);
  return mesh;
};
