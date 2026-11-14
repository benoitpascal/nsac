import {
  CanvasTexture,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';
import type { WorldAppearance } from '../world-appearance';

const GROUND_SIZE_M = 1200;
const TILE_PIXELS = 128;
const TILE_SIZE_M = 4;
const SPECKS = 900;

/** Draws a seamless tile of ground: a base color sprinkled with darker specks. */
const drawTile = ([base, speck]: [string, string]) => {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_PIXELS;
  canvas.height = TILE_PIXELS;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');
  context.fillStyle = base;
  context.fillRect(0, 0, TILE_PIXELS, TILE_PIXELS);
  context.fillStyle = speck;
  for (let index = 0; index < SPECKS; index++) {
    const size = 1 + ((index * 7) % 3);
    context.fillRect(
      (index * 37) % TILE_PIXELS,
      (index * 91 + index * index) % TILE_PIXELS,
      size,
      size,
    );
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(GROUND_SIZE_M / TILE_SIZE_M, GROUND_SIZE_M / TILE_SIZE_M);
  return texture;
};

/** Creates the flat ground of a world, wide enough to walk for a long time. */
export const createGround = (appearance: WorldAppearance) => {
  const material = new MeshStandardMaterial({ map: drawTile(appearance.ground), roughness: 1 });
  const ground = new Mesh(new PlaneGeometry(GROUND_SIZE_M, GROUND_SIZE_M), material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  return ground;
};
