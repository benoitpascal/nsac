import { AmbientLight, DirectionalLight, HemisphereLight, Vector3 } from 'three';
import { earthDirection } from '../../core/sky/lunar-sky';
import { snapToShadowPixels } from './shadow-snap';
import type { WorldAppearance } from '../world-appearance';
import type { Scene } from 'three';

/** Where the sunlight comes from on worlds without a moving Sun (to be read, not changed). */
export const FIXED_SUN = new Vector3(-40, 60, 20).normalize();
/** How far from the walker the sunlight is placed, along its direction (m). */
const SUN_DISTANCE_M = 120;
/**
 * Shadows are drawn around the walker, wide enough for the long shadows of a low Sun to reach
 * from the buildings, and sharp enough for the astronaut.
 */
const SHADOW = {
  mapSize: 4096,
  bounds: { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 300 },
  normalBias: 0.04,
};
/** Width of one shadow-map pixel on the ground (m). */
const SHADOW_PIXEL_M = (SHADOW.bounds.right - SHADOW.bounds.left) / SHADOW.mapSize;
/** Share of the fill light coming from all around, the rest from the sky above. */
const AMBIENT_SHARE = 0.8;
/** Light of the full Earth on the Moon's ground at night: far brighter than a full Moon on the Earth. */
const EARTHSHINE = { color: 0x9fb8ff, full: 0.35 };
/** The sunlight fades as the Sun sinks, reaching zero as its disc goes under the horizon. */
const SUNSET_HEIGHT = 0.03;

/**
 * The lights of the walk: the Sun and its shadows, the earthshine on the Moon, and a fill light
 * standing for the glow of the sky or for sunlight bouncing off the ground.
 */
export const createLightRig = (scene: Scene) => {
  const sun = new DirectionalLight(0xffffff, 1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(SHADOW.mapSize, SHADOW.mapSize);
  sun.shadow.normalBias = SHADOW.normalBias;
  Object.assign(sun.shadow.camera, SHADOW.bounds);
  const earthshine = new DirectionalLight(EARTHSHINE.color, 0);
  const skyLight = new HemisphereLight(0xffffff, 0x222222, 1);
  const ambient = new AmbientLight(0xffffff, 1);
  scene.add(sun, sun.target, earthshine, earthshine.target, skyLight, ambient);
  const toSun = FIXED_SUN.clone();
  let sunlight = 1;
  return {
    /** Sets the lights of a world, with its Sun standing still until `follow` moves it. */
    paint: (appearance: WorldAppearance) => {
      sunlight = appearance.sunlight;
      toSun.copy(FIXED_SUN);
      sun.intensity = sunlight;
      sun.visible = true;
      skyLight.color.set(appearance.sky);
      skyLight.intensity = appearance.fill;
      ambient.intensity = appearance.fill * AMBIENT_SHARE;
      earthshine.visible = appearance.lunarSky === true;
    },
    /** Moves the Sun to the given direction, dimming it as it sets, and sets the earthshine. */
    follow: (direction: Vector3, earthLit: number) => {
      toSun.copy(direction);
      const rising = Math.min(Math.max(direction.y / SUNSET_HEIGHT, 0), 1);
      sun.intensity = sunlight * rising;
      sun.visible = rising > 0;
      earthshine.intensity = EARTHSHINE.full * earthLit;
    },
    /** Keeps the sunlight, its shadows and the earthshine centered on the walker. */
    around: (spot: { x: number; z: number }) => {
      const center = snapToShadowPixels(new Vector3(spot.x, 0, spot.z), toSun, SHADOW_PIXEL_M);
      sun.target.position.copy(center);
      sun.position.copy(center).addScaledVector(toSun, SUN_DISTANCE_M);
      const toEarth = earthDirection();
      earthshine.position.set(spot.x + toEarth.x, toEarth.y, spot.z + toEarth.z);
      earthshine.target.position.set(spot.x, 0, spot.z);
    },
  };
};
