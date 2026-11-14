import { DoubleSide, MeshStandardMaterial, PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createSolarPanelTexture } from './solar-panel.texture';
import type { BodyContext } from '../body';
import type { Material, Texture, WebGLRenderer } from 'three';

export type SatelliteMaterials = {
  foil: Material;
  panel: Material;
  metal: Material;
  dish: Material;
  silverFoil: Material;
  aperture: Material;
  whitePaint: Material;
  darkMetal: Material;
};

const REFLECTION_INTENSITY = 0.35;
const GOLD_FOIL = 0xd4a24c;
const BRUSHED_METAL = 0xb8bec9;
const DISH_WHITE = 0xf2f2ee;
const SILVER_FOIL = 0xdfe3ea;
const APERTURE_BLACK = 0x0b0b0f;
const WHITE_PAINT = 0xeeeeea;
const DARK_METAL = 0x3a3f4a;

/** Returns a soft studio environment for shiny surfaces to reflect. */
export const createReflections = (renderer: WebGLRenderer): Texture => {
  const generator = new PMREMGenerator(renderer);
  const reflections = generator.fromScene(new RoomEnvironment()).texture;
  generator.dispose();
  return reflections;
};

/**
 * Creates the satellite surfaces, reflecting a neutral studio environment.
 */
export const createSatelliteMaterials = (context: BodyContext): SatelliteMaterials => {
  const shared = {
    envMap: createReflections(context.renderer),
    envMapIntensity: REFLECTION_INTENSITY,
  };
  return {
    foil: new MeshStandardMaterial({ ...shared, color: GOLD_FOIL, metalness: 1, roughness: 0.35 }),
    panel: new MeshStandardMaterial({
      ...shared,
      map: createSolarPanelTexture(),
      metalness: 0.6,
      roughness: 0.3,
    }),
    metal: new MeshStandardMaterial({
      ...shared,
      color: BRUSHED_METAL,
      metalness: 1,
      roughness: 0.4,
    }),
    dish: new MeshStandardMaterial({
      ...shared,
      color: DISH_WHITE,
      roughness: 0.6,
      side: DoubleSide,
    }),
    silverFoil: new MeshStandardMaterial({
      ...shared,
      color: SILVER_FOIL,
      metalness: 1,
      roughness: 0.25,
    }),
    aperture: new MeshStandardMaterial({ color: APERTURE_BLACK, roughness: 0.9 }),
    whitePaint: new MeshStandardMaterial({ ...shared, color: WHITE_PAINT, roughness: 0.7 }),
    darkMetal: new MeshStandardMaterial({
      ...shared,
      color: DARK_METAL,
      metalness: 0.8,
      roughness: 0.45,
    }),
  };
};
