import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import type { Texture } from 'three';

const SIZE = 512;
const CRUMPLES = 900;
const TAPE_EVERY = 128;

const randomFrom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

/** Small facets of foil catching the light at different angles: lighter or darker triangles. */
const crumple = (context: CanvasRenderingContext2D, color: number[], random: () => number) => {
  for (let index = 0; index < CRUMPLES; index++) {
    const shade = 0.55 + random() * 0.75;
    context.fillStyle = `rgb(${color.map((part) => Math.min(255, part * shade)).join()})`;
    const [x, y, size] = [random() * SIZE, random() * SIZE, 10 + random() * 34];
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + (random() - 0.3) * size, y + (random() - 0.5) * size);
    context.lineTo(x + (random() - 0.5) * size, y + (random() - 0.3) * size);
    context.closePath();
    context.fill();
  }
};

/** Strips of tape holding the foil blankets together, every few hand-widths. */
const tape = (context: CanvasRenderingContext2D) => {
  context.fillStyle = 'rgba(40, 32, 20, 0.35)';
  for (let at = 0; at < SIZE; at += TAPE_EVERY) {
    context.fillRect(at, 0, 4, SIZE);
    context.fillRect(0, at, SIZE, 4);
  }
};

const cache = new Map<number, { map: Texture; bumpMap: Texture }>();

/**
 * Returns crinkled foil of the given color (0xRRGGBB), as wrapped round a lander's descent stage
 * to keep the heat and the cold out: a color and a bump picture of crumpled facets and tape seams,
 * repeated the given number of times across and up.
 */
export const crinkledFoil = (color: number, across: number, up: number) => {
  let foil = cache.get(color);
  if (!foil) {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('2D canvas context is not available');
    const parts = [(color >> 16) & 255, (color >> 8) & 255, color & 255];
    context.fillStyle = `rgb(${parts.join()})`;
    context.fillRect(0, 0, SIZE, SIZE);
    crumple(context, parts, randomFrom(color % 9973));
    tape(context);
    const [map, bumpMap] = [new CanvasTexture(canvas), new CanvasTexture(canvas)];
    map.colorSpace = SRGBColorSpace;
    foil = { map, bumpMap };
    cache.set(color, foil);
  }
  const [map, bumpMap] = [foil.map.clone(), foil.bumpMap.clone()];
  for (const texture of [map, bumpMap]) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(across, up);
  }
  return { map, bumpMap };
};
