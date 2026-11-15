import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { randomFrom, wrappingNoise } from './wrapping-noise';

const TILE_PIXELS = 512;
/** Blotches of finer and coarser dust across the tile, repeating seamlessly at its edges. */
const BLOTCH_CELLS = 8;
const PEBBLES = 520;
/** Each stone is drawn again one tile away on every side, so that stones cut by an edge carry on across it. */
const WRAP_SHIFTS = [-1, 0, 1].flatMap((column) =>
  [-1, 0, 1].map((row) => [column * TILE_PIXELS, row * TILE_PIXELS]),
);

/** Grey levels of the regolith: fine grain over blotches, as one byte per pixel. */
const drawDust = (random: () => number) => {
  const blotches = wrappingNoise(BLOTCH_CELLS, random);
  const detail = wrappingNoise(BLOTCH_CELLS * 4, random);
  const levels = new Uint8ClampedArray(TILE_PIXELS * TILE_PIXELS);
  for (let y = 0; y < TILE_PIXELS; y++) {
    for (let x = 0; x < TILE_PIXELS; x++) {
      const [u, v] = [x / TILE_PIXELS, y / TILE_PIXELS];
      const shade = 0.55 * blotches(u, v) + 0.3 * detail(u, v) + 0.15 * random();
      levels[y * TILE_PIXELS + x] = 120 + shade * 110;
    }
  }
  return levels;
};

/** Scatters small stones, each with a lit and a shaded side, wrapping around the tile's edges. */
const drawPebbles = (context: CanvasRenderingContext2D, random: () => number) => {
  for (let index = 0; index < PEBBLES; index++) {
    const [x, y] = [random() * TILE_PIXELS, random() * TILE_PIXELS];
    const radius = 0.8 + random() ** 4 * 5;
    const shine = 0.35 + random() * 0.4;
    for (const [shiftX, shiftY] of WRAP_SHIFTS) {
      context.fillStyle = 'rgba(30, 30, 30, 0.5)';
      context.beginPath();
      context.ellipse(
        x + shiftX + radius * 0.4,
        y + shiftY + radius * 0.3,
        radius,
        radius * 0.8,
        0,
        0,
        Math.PI * 2,
      );
      context.fill();
      context.fillStyle = `rgba(235, 235, 235, ${shine})`;
      context.beginPath();
      context.ellipse(x + shiftX, y + shiftY, radius * 0.85, radius * 0.7, 0, 0, Math.PI * 2);
      context.fill();
    }
  }
};

const toTexture = (canvas: HTMLCanvasElement, repeat: number, color: boolean) => {
  const texture = new CanvasTexture(canvas);
  if (color) texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = 8;
  return texture;
};

/**
 * Draws a seamless tile of grey regolith, dust and small stones, to be tinted by the world's
 * ground color, and returns it both as a color map and as a bump map for its tiny relief.
 */
export const drawRegolith = (repeat: number) => {
  const random = randomFrom(11);
  const canvas = document.createElement('canvas');
  canvas.width = TILE_PIXELS;
  canvas.height = TILE_PIXELS;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');
  const levels = drawDust(random);
  const image = context.createImageData(TILE_PIXELS, TILE_PIXELS);
  levels.forEach((level, index) => image.data.set([level, level, level, 255], index * 4));
  context.putImageData(image, 0, 0);
  drawPebbles(context, random);
  return { map: toTexture(canvas, repeat, true), bumpMap: toTexture(canvas, repeat, false) };
};
