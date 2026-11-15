import { AdditiveBlending, CanvasTexture, SRGBColorSpace, Sprite, SpriteMaterial } from 'three';

const TEXTURE_PIXELS = 256;
/** How wide the glare looks around the Sun (degrees); the Sun's disc itself is about 0.5°. */
const GLARE_DEGREES = 9;

const drawGlare = () => {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_PIXELS;
  canvas.height = TEXTURE_PIXELS;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');
  const middle = TEXTURE_PIXELS / 2;
  const gradient = context.createRadialGradient(middle, middle, 0, middle, middle, middle);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.05, 'rgba(255, 252, 240, 1)');
  gradient.addColorStop(0.09, 'rgba(255, 240, 210, 0.45)');
  gradient.addColorStop(0.3, 'rgba(255, 225, 180, 0.08)');
  gradient.addColorStop(1, 'rgba(255, 220, 170, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, TEXTURE_PIXELS, TEXTURE_PIXELS);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

/**
 * Creates the Sun as a blinding white point with its glare, to be placed far away in its direction.
 * Without air there is no blue sky around it: only black.
 */
export const createSunGlare = (distance: number) => {
  const glare = new Sprite(
    new SpriteMaterial({
      map: drawGlare(),
      blending: AdditiveBlending,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    }),
  );
  glare.scale.setScalar(2 * distance * Math.tan(((GLARE_DEGREES / 2) * Math.PI) / 180) * 2);
  glare.renderOrder = -1;
  return glare;
};
