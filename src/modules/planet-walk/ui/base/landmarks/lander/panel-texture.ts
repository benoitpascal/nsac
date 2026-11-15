import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import type { Texture } from 'three';

const SIZE = 512;
const GRID = 6;
/** Greys of the cabin's panels, from silver foil to dark paint, the light ones most common. */
const SHADES = [228, 214, 200, 186, 168, 150, 70];

const randomFrom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

let panels: { map: Texture; bumpMap: Texture } | undefined;

/**
 * Returns the patchwork of the crew cabin's skin, as on the landers of the intro: square panels of
 * silver and grey, a few dark ones, with seams between them, repeated the given number of times
 * across and up.
 */
export const cabinPanels = (across: number, up: number) => {
  panels ??= drawPanels();
  const [map, bumpMap] = [panels.map.clone(), panels.bumpMap.clone()];
  for (const texture of [map, bumpMap]) {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(across, up);
  }
  return { map, bumpMap };
};

const drawPanels = () => {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');
  const random = randomFrom(5);
  const cell = SIZE / GRID;
  for (let row = 0; row < GRID; row++) {
    for (let column = 0; column < GRID; column++) {
      const shade = SHADES[Math.floor(random() ** 1.6 * SHADES.length)];
      context.fillStyle = `rgb(${shade}, ${shade}, ${shade + 4})`;
      const split = random() < 0.4 ? 2 : 1;
      for (let part = 0; part < split; part++) {
        context.fillRect(column * cell, row * cell + (part * cell) / split, cell, cell / split);
        context.fillStyle = `rgb(${shade - 18}, ${shade - 18}, ${shade - 14})`;
      }
    }
  }
  context.strokeStyle = 'rgba(30, 30, 34, 0.7)';
  context.lineWidth = 3;
  for (let line = 0; line <= GRID; line++) {
    context.strokeRect(0, line * cell, SIZE, 0);
    context.strokeRect(line * cell, 0, 0, SIZE);
  }
  const [map, bumpMap] = [new CanvasTexture(canvas), new CanvasTexture(canvas)];
  map.colorSpace = SRGBColorSpace;
  return { map, bumpMap };
};
