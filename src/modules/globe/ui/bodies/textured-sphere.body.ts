import { Mesh, MeshStandardMaterial, SphereGeometry, SRGBColorSpace, TextureLoader } from 'three';
import { createSpinningBody } from './body';
import { addSpinBlur } from './spin-blur';
import type { Body, BodyContext } from './body';

export type TexturedSphere = {
  textureUrl: string;
  reliefScale: number;
};

const SPHERE_SEGMENTS = 128;

/**
 * Creates a sunlit sphere from a single color map, which also drives the relief
 * when the relief scale is not zero (rocky bodies). Gas giants use a zero relief.
 */
export const createTexturedSphere = async (
  sphere: TexturedSphere,
  context: BodyContext,
): Promise<Mesh<SphereGeometry, MeshStandardMaterial>> => {
  const surface = await new TextureLoader().loadAsync(sphere.textureUrl);
  surface.colorSpace = SRGBColorSpace;
  surface.anisotropy = context.renderer.capabilities.getMaxAnisotropy();
  const material = new MeshStandardMaterial({ map: surface, roughness: 1, metalness: 0 });
  if (sphere.reliefScale > 0) {
    material.bumpMap = surface;
    material.bumpScale = sphere.reliefScale;
  }
  return new Mesh(new SphereGeometry(1, SPHERE_SEGMENTS, SPHERE_SEGMENTS), material);
};

/**
 * Creates a spinning planet or moon from a textured sphere.
 */
export const createTexturedSphereBody = async (
  sphere: TexturedSphere,
  context: BodyContext,
  axialTilt: number,
): Promise<Body> => {
  const mesh = await createTexturedSphere(sphere, context);
  return { ...createSpinningBody(mesh, axialTilt), setSpinBlur: addSpinBlur(mesh.material) };
};
