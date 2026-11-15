import { Mesh, ShaderMaterial, SphereGeometry, SRGBColorSpace, TextureLoader } from 'three';
import { earthVertexShader } from '../shaders/earth-vertex.shader';
import { earthFragmentShader } from '../shaders/earth.shader';
import { createAtmosphere } from './atmosphere.mesh';
import { createSpinningBody } from './body';
import { wrapAroundSphere } from './spin-blur';
import type { Body, BodyContext } from './body';
import type { Texture, Vector3 } from 'three';

type EarthTextures = {
  day: Texture;
  night: Texture;
  surface: Texture;
};

const TEXTURE_FOLDER = '/textures/earth';
const SPHERE_SEGMENTS = 128;

const loadEarthTextures = async (anisotropy: number): Promise<EarthTextures> => {
  const loader = new TextureLoader();
  const [day, night, surface] = await Promise.all([
    loader.loadAsync(`${TEXTURE_FOLDER}/earth_day_4096.jpg`),
    loader.loadAsync(`${TEXTURE_FOLDER}/earth_night_4096.jpg`),
    loader.loadAsync(`${TEXTURE_FOLDER}/earth_bump_roughness_clouds_4096.jpg`),
  ]);
  day.colorSpace = SRGBColorSpace;
  night.colorSpace = SRGBColorSpace;
  for (const texture of [day, night, surface]) texture.anisotropy = anisotropy;
  wrapAroundSphere([day, night, surface]);
  return { day, night, surface };
};

const createEarthMaterial = (textures: EarthTextures, sunDirection: Vector3) =>
  new ShaderMaterial({
    uniforms: {
      dayMap: { value: textures.day },
      nightMap: { value: textures.night },
      surfaceMap: { value: textures.surface },
      sunDirection: { value: sunDirection },
      cloudsOffset: { value: 0 },
      spinBlur: { value: 0 },
    },
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
  });

/**
 * Creates the Earth, with city lights on its night side, drifting clouds and a glowing atmosphere.
 */
export const createEarthBody = async (context: BodyContext, axialTilt: number): Promise<Body> => {
  const textures = await loadEarthTextures(context.renderer.capabilities.getMaxAnisotropy());
  const material = createEarthMaterial(textures, context.sunDirection);
  const earth = new Mesh(new SphereGeometry(1, SPHERE_SEGMENTS, SPHERE_SEGMENTS), material);
  const body = createSpinningBody(earth, axialTilt, [createAtmosphere(context.sunDirection)]);
  return {
    root: body.root,
    update: (rotation) => {
      body.update(rotation);
      material.uniforms.cloudsOffset.value = rotation.cloudsOffset;
    },
    setSpinBlur: (turns) => {
      material.uniforms.spinBlur.value = turns;
    },
  };
};
