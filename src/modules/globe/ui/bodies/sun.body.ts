import {
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { createSpinningBody } from './body';
import { addSpinBlur } from './spin-blur';
import type { Body, BodyContext } from './body';

const SURFACE_TEXTURE = '/textures/sun/sun_4096.jpg';
const SPHERE_SEGMENTS = 96;
const SURFACE_GLOW = new Color(1.2, 1.1, 1);
const CORONA_SIZE = 512;
const CORONA_SCALE = 3.6;
const FIT_IN_VIEW_SCALE = 0.65;
const CORONA_STOPS: [number, string][] = [
  [0.55, 'rgba(255, 200, 110, 0.85)'],
  [0.66, 'rgba(255, 150, 60, 0.35)'],
  [0.8, 'rgba(255, 110, 30, 0.1)'],
  [1, 'rgba(255, 90, 20, 0)'],
];

const createCorona = () => {
  const canvas = document.createElement('canvas');
  canvas.width = CORONA_SIZE;
  canvas.height = CORONA_SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');
  const center = CORONA_SIZE / 2;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);
  for (const [offset, color] of CORONA_STOPS) gradient.addColorStop(offset, color);
  context.fillStyle = gradient;
  context.fillRect(0, 0, CORONA_SIZE, CORONA_SIZE);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  const corona = new Sprite(new SpriteMaterial({ map: texture, depthWrite: false }));
  corona.scale.setScalar(CORONA_SCALE);
  return corona;
};

/**
 * Creates the Sun: a self-lit surface (unaffected by the scene light) wrapped in a glowing corona,
 * scaled down so the corona fades out inside the view.
 */
export const createSunBody = async (context: BodyContext, axialTilt: number): Promise<Body> => {
  const surface = await new TextureLoader().loadAsync(SURFACE_TEXTURE);
  surface.colorSpace = SRGBColorSpace;
  surface.anisotropy = context.renderer.capabilities.getMaxAnisotropy();
  const material = new MeshBasicMaterial({ map: surface, color: SURFACE_GLOW });
  const sphere = new Mesh(new SphereGeometry(1, SPHERE_SEGMENTS, SPHERE_SEGMENTS), material);
  const sun = createSpinningBody(sphere, axialTilt, [createCorona()]);
  sun.root.scale.setScalar(FIT_IN_VIEW_SCALE);
  return { ...sun, setSpinBlur: addSpinBlur(material) };
};
