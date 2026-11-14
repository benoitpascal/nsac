import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  FogExp2,
  Points,
  PointsMaterial,
} from 'three';
import type { WorldAppearance } from '../world-appearance';
import type { Scene } from 'three';

const STAR_COUNT = 1500;
const STAR_DISTANCE_M = 900;

/** Stars seen in the black sky of a world without air, far around the walker. */
export const createStars = () => {
  const positions = Array.from({ length: STAR_COUNT }, () => {
    const z = Math.random() * 2 - 1;
    const angle = Math.random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z) * STAR_DISTANCE_M;
    return [Math.cos(angle) * ring, Math.abs(z) * STAR_DISTANCE_M, Math.sin(angle) * ring];
  }).flat();
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const material = new PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    sizeAttenuation: false,
    fog: false,
  });
  return new Points(geometry, material);
};

/** Paints the sky and the haze of the world: black and clear without air, hazy with thick air. */
export const paintSky = (scene: Scene, appearance: WorldAppearance) => {
  scene.background = new Color(appearance.sky);
  scene.fog = appearance.haze > 0 ? new FogExp2(appearance.sky, appearance.haze) : null;
};
