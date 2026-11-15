import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import type { Texture } from 'three';

const SIZE = 256;
const CLOTH = '#e4e2dc';
/** Grey moon dust, thicker towards the bottom of the dusty variant. */
const DUST = [120, 118, 112];

const randomFrom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

/** Woven outer cloth: a fine criss-cross weave, deep wrinkles across the limb and a stitched seam. */
const weave = (context: CanvasRenderingContext2D, random: () => number) => {
  context.fillStyle = CLOTH;
  context.fillRect(0, 0, SIZE, SIZE);
  for (let line = 0; line < SIZE; line += 3) {
    context.fillStyle = `rgba(90, 88, 80, ${0.04 + random() * 0.04})`;
    context.fillRect(0, line, SIZE, 1);
    context.fillRect(line, 0, 1, SIZE);
  }
  for (let fold = 0; fold < 16; fold++) {
    const y = random() * SIZE;
    const gradient = context.createLinearGradient(0, y - 8, 0, y + 8);
    gradient.addColorStop(0, 'rgba(60, 58, 52, 0)');
    gradient.addColorStop(0.5, `rgba(60, 58, 52, ${0.12 + random() * 0.16})`);
    gradient.addColorStop(1, 'rgba(60, 58, 52, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, y - 8, SIZE, 16);
  }
  context.fillStyle = 'rgba(70, 70, 70, 0.35)';
  for (let y = 0; y < SIZE; y += 8) context.fillRect(SIZE / 2, y, 2, 4);
};

/** Grey dust rising from the bottom (v = 0) of the picture, in patches. */
const dust = (context: CanvasRenderingContext2D, random: () => number) => {
  const gradient = context.createLinearGradient(0, SIZE, 0, 0);
  gradient.addColorStop(0, `rgba(${DUST.join()}, 0.55)`);
  gradient.addColorStop(0.6, `rgba(${DUST.join()}, 0.1)`);
  gradient.addColorStop(1, `rgba(${DUST.join()}, 0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, SIZE, SIZE);
  for (let patch = 0; patch < 60; patch++) {
    const [x, y] = [random() * SIZE, SIZE - random() ** 2 * SIZE];
    context.fillStyle = `rgba(${DUST.join()}, ${0.05 + random() * 0.1})`;
    context.beginPath();
    context.ellipse(x, y, 4 + random() * 14, 3 + random() * 8, 0, 0, Math.PI * 2);
    context.fill();
  }
};

const toTextures = (canvas: HTMLCanvasElement) => {
  const [map, bumpMap] = [new CanvasTexture(canvas), new CanvasTexture(canvas)];
  map.colorSpace = SRGBColorSpace;
  for (const texture of [map, bumpMap]) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.anisotropy = 8;
  }
  return { map, bumpMap };
};

/** The suit's outer cloth as a color and a bump picture, clean or dusty from walking. */
export const suitCloth = (dusty: boolean): { map: Texture; bumpMap: Texture } => {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');
  const random = randomFrom(dusty ? 11 : 7);
  weave(context, random);
  if (dusty) dust(context, random);
  return toTextures(canvas);
};
