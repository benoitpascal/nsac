import type { EclipticPosition } from './orbit';

/** Position in the 3D scene, with y pointing to the ecliptic north. */
export type ScenePosition = {
  x: number;
  y: number;
  z: number;
};

/** Scene units for one astronomical unit. */
export const SCENE_UNITS_PER_AU = 7;

/** Maps an ecliptic vector onto the scene axes, without changing its length. */
export const toSceneAxes = ({ x, y, z }: EclipticPosition): ScenePosition => ({ x, y: z, z: -y });

/**
 * Maps an ecliptic vector into the scene, scaled to the given length,
 * keeping its direction as is.
 */
export const toSceneOffset = (position: EclipticPosition, length: number): ScenePosition => {
  const distance = Math.hypot(position.x, position.y, position.z);
  if (distance === 0) return { x: 0, y: 0, z: 0 };
  const { x, y, z } = toSceneAxes(position);
  const scale = length / distance;
  return { x: x * scale, y: y * scale, z: z * scale };
};

/** Maps a position given in AU into the scene, keeping every distance to scale. */
export const toScenePosition = (position: EclipticPosition): ScenePosition =>
  toSceneOffset(position, SCENE_UNITS_PER_AU * Math.hypot(position.x, position.y, position.z));
