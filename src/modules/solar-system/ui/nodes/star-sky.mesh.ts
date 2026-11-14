import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  ShaderMaterial,
} from 'three';
import { toSceneOffset } from '../../core/scene-scale';
import { starDirection } from '../../core/star';
import { starBrightness, starColor, starPointSize } from './star-appearance';
import { starSkyFragmentShader, starSkyVertexShader } from '../shaders/star-sky.shader';
import type { Star } from '../../core/star';

const SKY_RADIUS = 4000;
const MAX_PIXEL_RATIO = 2;

/**
 * Creates the sky of real stars, at their J2000 positions, as a far sphere to be kept centered
 * on the camera so that the stars stay at infinity while the camera moves.
 */
export const createStarSky = (stars: Star[]): Points => {
  const positions = stars.flatMap((star) => {
    const { x, y, z } = toSceneOffset(starDirection(star), SKY_RADIUS);
    return [x, y, z];
  });
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute(
    'starColor',
    new Float32BufferAttribute(
      stars.flatMap((star) => starColor(star.colorIndex).toArray()),
      3,
    ),
  );
  geometry.setAttribute(
    'pointSize',
    new Float32BufferAttribute(
      stars.map((star) => starPointSize(star.magnitude)),
      1,
    ),
  );
  geometry.setAttribute(
    'brightness',
    new Float32BufferAttribute(
      stars.map((star) => starBrightness(star.magnitude)),
      1,
    ),
  );
  const material = new ShaderMaterial({
    uniforms: { pixelRatio: { value: Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO) } },
    vertexShader: starSkyVertexShader,
    fragmentShader: starSkyFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const sky = new Points(geometry, material);
  sky.frustumCulled = false;
  return sky;
};
