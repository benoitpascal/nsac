import { Group, Vector3 } from 'three';
import {
  earthDirection,
  skyTurn,
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

/**
 * The sky over the Moon's south pole: the real stars and the Milky Way turning slowly around the
 * zenith, the Sun circling low around the horizon, and the Earth hanging still above the hills,
 * lit by the same Sun as the ground, so that its phase always matches the time of day.
 */
export const createLunarSkyDome = (renderer: WebGLRenderer, loadStars: () => Promise<Star[]>) => {
  const dome = new Group();
  dome.name = 'lunar-sky';
  /** Turns the starry sky around the zenith. */
  const turning = new Group();
  /** Puts the ecliptic's south pole at the zenith, as seen from the Moon's south pole. */
  const southUp = new Group();
  southUp.rotation.x = Math.PI;
  turning.add(southUp);
  southUp.add(createMilkyWay(SKY.milkyWay, MILKY_WAY_INTENSITY));
  const sunGlare = createSunGlare(SKY.sun);
  dome.add(turning, sunGlare);

  /** Direction to the Sun, shared with the sunlight and the Earth's shading. */
  const toSun = new Vector3(0, 1, 0);
  let earth: Awaited<ReturnType<typeof createEarthBody>> | undefined;
  const earthSpot = new Vector3().copy(earthDirection()).multiplyScalar(SKY.earth);

  void loadStars()
    .then((stars) => southUp.add(createStarSky(stars)))
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
      turning.rotation.y = sunEclipticLongitude(timestamp) - skyTurn(dayShare) + Math.PI / 2;
      earth?.update({ surface: ((timestamp / MS_PER_DAY) % 1) * 2 * Math.PI, cloudsOffset: 0 });
    },
    /** Keeps the sky around the eye, so that it looks infinitely far. */
    followEye: (eye: Object3D) => dome.position.copy(eye.position),
  };
};
