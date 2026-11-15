import { MeshStandardMaterial, RepeatWrapping } from 'three';
import { spinBlurMapFragment, spinBlurOffsetFunction } from '../shaders/spin-blur.shader';
import type { MeshBasicMaterial, Texture } from 'three';

/** Sets the fraction of a turn (0 for a sharp surface) over which the surface is smeared. */
export type SpinBlurSetter = (turns: number) => void;

/** Lets the given textures wrap around the sphere, so a smeared surface has no seam. */
export const wrapAroundSphere = (textures: Texture[]) => {
  for (const texture of textures) {
    texture.wrapS = RepeatWrapping;
    texture.needsUpdate = true;
  }
};

/**
 * Smears the color map of the material along the spin, the way a surface turning too fast
 * looks to the eye; the relief is flattened while smeared.
 */
export const addSpinBlur = (material: MeshStandardMaterial | MeshBasicMaterial): SpinBlurSetter => {
  const spinBlur = { value: 0 };
  const reliefScale = material instanceof MeshStandardMaterial ? material.bumpScale : 0;
  if (material.map) wrapAroundSphere([material.map]);
  material.onBeforeCompile = (shader) => {
    shader.uniforms.spinBlur = spinBlur;
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', `uniform float spinBlur;\n${spinBlurOffsetFunction}\nvoid main() {`)
      .replace('#include <map_fragment>', spinBlurMapFragment);
  };
  return (turns) => {
    spinBlur.value = turns;
    if (material instanceof MeshStandardMaterial) material.bumpScale = turns > 0 ? 0 : reliefScale;
  };
};
