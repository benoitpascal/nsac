import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { drawTile } from './hull-paint';
import type { Texture } from 'three';

const toTexture = (canvas: HTMLCanvasElement, color: boolean) => {
  const texture = new CanvasTexture(canvas);
  if (color) texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
};

let plating: { map: Texture; bumpMap: Texture } | undefined;

/**
 * Returns the white hull plating of the base's modules, repeated the given number of times across
 * and along a surface: panels of slightly different whites, grey seams, rivets and moon dust. The
 * picture is drawn and sent to the graphics card once, and shared by every module.
 */
export const hullPlating = (across: number, along: number): { map: Texture; bumpMap: Texture } => {
  if (!plating) {
    const canvas = drawTile();
    plating = { map: toTexture(canvas, true), bumpMap: toTexture(canvas, false) };
  }
  const [map, bumpMap] = [plating.map.clone(), plating.bumpMap.clone()];
  map.repeat.set(across, along);
  bumpMap.repeat.set(across, along);
  return { map, bumpMap };
};
