import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three';

const COLOR = 0xff5a1a;
/** A short flash every this many milliseconds, like an obstacle light on a tower. */
const FLASH = { periodMs: 1600, onMs: 450, bright: 6, dim: 0.4 };

/** Shared by every beacon of the base, so that they all flash together. */
const glow = new MeshStandardMaterial({
  color: COLOR,
  emissive: COLOR,
  emissiveIntensity: FLASH.bright,
});

/** Creates a small orange beacon light, to put on top of a mast or an antenna. */
export const createBeacon = (radius = 0.12) => new Mesh(new SphereGeometry(radius, 12, 8), glow);

/** Makes every beacon flash at the given time (Unix ms). */
export const flashBeacons = (timestamp: number) => {
  glow.emissiveIntensity = timestamp % FLASH.periodMs < FLASH.onMs ? FLASH.bright : FLASH.dim;
};
