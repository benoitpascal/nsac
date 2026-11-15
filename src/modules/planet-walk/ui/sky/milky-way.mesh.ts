import { AdditiveBlending, BackSide, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from 'three';
import { milkyWayFragmentShader, milkyWayVertexShader } from './milky-way.shader';
import { starDirection } from '@/modules/solar-system/core/star';
import { toSceneAxes } from '@/modules/solar-system/core/scene-scale';

/** Galactic north pole and galactic center, in J2000 equatorial coordinates (IAU 1958). */
const GALACTIC_POLE = { rightAscensionHours: 192.85948 / 15, declinationDegrees: 27.12825 };
const GALACTIC_CENTER = { rightAscensionHours: 266.405 / 15, declinationDegrees: -28.93617 };

const inSkyFrame = (place: { rightAscensionHours: number; declinationDegrees: number }) => {
  const { x, y, z } = toSceneAxes(starDirection({ ...place, magnitude: 0, colorIndex: 0 }));
  return new Vector3(x, y, z);
};

/**
 * Creates the glow of the Milky Way on a far sphere, laid along the real galactic plane in the same
 * frame as the catalog stars, so that both turn together.
 */
export const createMilkyWay = (radius: number, intensity: number) => {
  const material = new ShaderMaterial({
    uniforms: {
      galacticPole: { value: inSkyFrame(GALACTIC_POLE) },
      galacticCenter: { value: inSkyFrame(GALACTIC_CENTER) },
      intensity: { value: intensity },
    },
    vertexShader: milkyWayVertexShader,
    fragmentShader: milkyWayFragmentShader,
    side: BackSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(new SphereGeometry(radius, 64, 32), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -2;
  return mesh;
};
