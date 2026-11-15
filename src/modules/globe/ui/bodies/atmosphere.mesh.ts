import { BackSide, Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { atmosphereFragmentShader, atmosphereVertexShader } from '../shaders/atmosphere.shader';
import type { Vector3 } from 'three';

export type Atmosphere = Mesh<SphereGeometry, ShaderMaterial>;

const ATMOSPHERE_RADIUS = 1.08;
const SPHERE_SEGMENTS = 96;
const PLANET_EDGE_DEPTH = Math.sqrt(1 - (1 / ATMOSPHERE_RADIUS) ** 2);

/**
 * Creates the glowing halo around the unit-radius Earth, brighter on the side facing the sun.
 */
export const createAtmosphere = (sunDirection: Vector3): Atmosphere =>
  new Mesh(
    new SphereGeometry(ATMOSPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS),
    new ShaderMaterial({
      uniforms: {
        sunDirection: { value: sunDirection },
        shellThickness: { value: PLANET_EDGE_DEPTH },
      },
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      side: BackSide,
      premultipliedAlpha: true,
      transparent: true,
      depthWrite: false,
    }),
  );
