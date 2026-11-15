import {
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  RingGeometry,
  SRGBColorSpace,
  TextureLoader,
} from 'three';
import { createSpinningBody } from './body';
import { addSpinBlur } from './spin-blur';
import { createTexturedSphere } from './textured-sphere.body';
import type { Body, BodyContext } from './body';

const PLANET_TEXTURE = '/textures/saturn/saturn_4096.jpg';
const RING_TEXTURE = '/textures/saturn/saturn_ring_2048.png';
const RING_INNER_RADIUS = 1.24;
const RING_OUTER_RADIUS = 2.27;
const RING_SEGMENTS = 256;
const FIT_IN_VIEW_SCALE = 0.48;

const createRingGeometry = () => {
  const geometry = new RingGeometry(RING_INNER_RADIUS, RING_OUTER_RADIUS, RING_SEGMENTS);
  const positions = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const ringWidth = RING_OUTER_RADIUS - RING_INNER_RADIUS;
  for (let index = 0; index < positions.count; index++) {
    const radius = Math.hypot(positions.getX(index), positions.getY(index));
    uvs.setXY(index, (radius - RING_INNER_RADIUS) / ringWidth, 0.5);
  }
  return geometry;
};

const createRings = async () => {
  const texture = await new TextureLoader().loadAsync(RING_TEXTURE);
  texture.colorSpace = SRGBColorSpace;
  const material = new MeshStandardMaterial({
    map: texture,
    transparent: true,
    side: DoubleSide,
    roughness: 1,
    depthWrite: false,
  });
  const rings = new Mesh(createRingGeometry(), material);
  rings.rotation.x = -Math.PI / 2;
  return rings;
};

/**
 * Creates Saturn with its ring system lying in its equatorial plane, scaled down to fit the view.
 */
export const createSaturnBody = async (context: BodyContext, axialTilt: number): Promise<Body> => {
  const [planet, rings] = await Promise.all([
    createTexturedSphere({ textureUrl: PLANET_TEXTURE, reliefScale: 0 }, context),
    createRings(),
  ]);
  const saturn = new Group();
  saturn.add(planet, rings);
  saturn.scale.setScalar(FIT_IN_VIEW_SCALE);
  return { ...createSpinningBody(saturn, axialTilt), setSpinBlur: addSpinBlur(planet.material) };
};
