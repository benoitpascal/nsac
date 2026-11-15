import { Group, Matrix4, Vector3 } from 'three';
import {
  celestialNorth,
  earthDirection,
  sunDirection,
  sunEclipticLongitude,
} from '../../core/sky/lunar-sky';
import { createMilkyWay } from './milky-way.mesh';
import { createSunGlare } from './sun-glare';
import type { Star } from '@/modules/solar-system/core/star';
import type { Object3D, WebGLRenderer } from 'three';
import { createStarSky } from '@/modules/solar-system/ui/nodes/star-sky.mesh';
import { createEarthBody } from '@/modules/globe/ui/bodies/earth.body';

/** Distances (m) of the sky objects: beyond the farthest hills, within the camera's reach. */
const SKY = { earth: 3000, sun: 3400, milkyWay: 3800 };
/**
 * The Earth seen from the Moon is about 1.9° wide. It is drawn twice as wide in the game, like a
 * photo through a zoom lens (see DATA.md).
 */
const EARTH_APPARENT_DEGREES = 1.9 * 2;
const EARTH_AXIAL_TILT = (23.44 * Math.PI) / 180;
const MILKY_WAY_INTENSITY = 0.12;
const MS_PER_DAY = 86_400_000;

/** Lays the sky's ecliptic frame (Sun among the stars, ecliptic north) onto the walker's sky. */
const skyFrame = (sunLongitude: number, toSun: Vector3, north: Vector3, target: Matrix4) => {
  const sunAmongStars = new Vector3(Math.cos(sunLongitude), 0, -Math.sin(sunLongitude));
  const eclipticNorth = new Vector3(0, 1, 0);
  const starsBasis = new Matrix4().makeBasis(
    sunAmongStars,
    eclipticNorth,
    new Vector3().crossVectors(sunAmongStars, eclipticNorth),
  );
  const skyBasis = new Matrix4().makeBasis(toSun, north, new Vector3().crossVectors(toSun, north));
  return target.multiplyMatrices(skyBasis, starsBasis.transpose());
};

/**
 * The sky over the base, near the Moon's equator: the real stars and the Milky Way rising in the
 * east and setting in the west once a lunar day, the Sun crossing high overhead, and the Earth
 * hanging still high in the west, lit by the same Sun as the ground.
 */
export const createLunarSkyDome = (renderer: WebGLRenderer, loadStars: () => Promise<Star[]>) => {
  const dome = new Group();
  dome.name = 'lunar-sky';
  /** The stars and the Milky Way, turned as the Moon turns under them. */
  const stars = new Group();
  stars.matrixAutoUpdate = false;
  stars.add(createMilkyWay(SKY.milkyWay, MILKY_WAY_INTENSITY));
  const sunGlare = createSunGlare(SKY.sun);
  dome.add(stars, sunGlare);
  const north = new Vector3().copy(celestialNorth());

  /** Direction to the Sun, shared with the sunlight and the Earth's shading. */
  const toSun = new Vector3(0, 1, 0);
  let earth: Awaited<ReturnType<typeof createEarthBody>> | undefined;
  const earthSpot = new Vector3().copy(earthDirection()).multiplyScalar(SKY.earth);

  void loadStars()
    .then((catalogue) => stars.add(createStarSky(catalogue)))
    .catch((error: unknown) =>
      console.warn('Stars unavailable, the sky stays without them', error),
    );
  void createEarthBody({ renderer, sunDirection: toSun }, EARTH_AXIAL_TILT)
    .then((body) => {
      body.root.position.copy(earthSpot);
      body.root.scale.setScalar(SKY.earth * Math.tan((EARTH_APPARENT_DEGREES * Math.PI) / 360));
      dome.add(body.root);
      earth = body;
    })
    .catch((error: unknown) => console.warn('Earth textures unavailable', error));

  return {
    dome,
    toSun,
    /** Sets the Sun, the stars and the Earth's turn for that local day share and time (Unix ms). */
    update: (dayShare: number, timestamp: number) => {
      toSun.copy(sunDirection(dayShare));
      sunGlare.position.copy(toSun).multiplyScalar(SKY.sun);
      sunGlare.visible = toSun.y > -0.02;
      skyFrame(sunEclipticLongitude(timestamp), toSun, north, stars.matrix);
      stars.matrixWorldNeedsUpdate = true;
      earth?.update({ surface: ((timestamp / MS_PER_DAY) % 1) * 2 * Math.PI, cloudsOffset: 0 });
    },
    /** Keeps the sky around the eye, so that it looks infinitely far. */
    followEye: (eye: Object3D) => dome.position.copy(eye.position),
  };
};
