import { Scene } from 'three';
import { disposeObject } from './dispose-object';
import { createGround } from './terrain/ground.mesh';
import { layOutRocks, rockObstacles } from './terrain/rock-layout';
import { createRocks } from './terrain/rocks.mesh';
import { createStars, paintSky } from './terrain/sky';
import { BASE_SITE } from './base/base-layout';
import { flashBeacons } from './base/beacon';
import { createSpaceBase } from './base/space-base';
import { createLightRig, FIXED_SUN } from './sky/light-rig';
import { createLunarSkyDome } from './sky/lunar-sky-dome';
import { createDaylightDimmer } from './sky/daylight-dimmer';
import { WORLD_APPEARANCES } from './world-appearance';
import { WORLD_CONDITIONS } from '../core/station/conditions';
import { localDayShare } from '../core/station/local-time';
import { daylight, earthFullness } from '../core/sky/lunar-sky';
import type { WalkWorldId } from '../core/walk-worlds';
import type { Star } from '@/modules/solar-system/core/star';
import type { Object3D, WebGLRenderer } from 'three';

/**
 * The ground, rocks, sky and sunlight around the walker, switched from one world to another,
 * with a space base standing ahead of the start. On the Moon, the Sun, the stars and the
 * earthshine follow the base's local time.
 */
export const createWalkScene = (renderer: WebGLRenderer, loadStars: () => Promise<Star[]>) => {
  const scene = new Scene();
  const lights = createLightRig(scene);
  const followDaylight = createDaylightDimmer(scene);
  const stars = createStars();
  const lunarSky = createLunarSkyDome(renderer, loadStars);
  const spaceBase = createSpaceBase(renderer);
  const rocks = layOutRocks(BASE_SITE);
  const ground = createGround();
  scene.add(stars, lunarSky.dome, spaceBase.base, ground.ground);
  let surface: Object3D[] = [];
  let worldId: WalkWorldId = 'moon';
  const showWorld = (id: WalkWorldId) => {
    worldId = id;
    const appearance = WORLD_APPEARANCES[id];
    scene.remove(...surface);
    surface.forEach((part) => disposeObject(part));
    ground.paint(appearance);
    surface = [createRocks(appearance.rock, rocks)];
    scene.add(...surface);
    paintSky(scene, appearance);
    lights.paint(appearance);
    stars.visible = appearance.stars && !appearance.lunarSky;
    lunarSky.dome.visible = appearance.lunarSky === true;
  };
  /** Moves the Sun, the stars and the earthshine to the base's local time (Unix ms). */
  let sunlit = 1;
  const setTime = (timestamp: number) => {
    const lunar = WORLD_APPEARANCES[worldId].lunarSky === true;
    const dayShare = localDayShare(WORLD_CONDITIONS[worldId], timestamp);
    if (lunar) lunarSky.update(dayShare, timestamp);
    if (lunar) lights.follow(lunarSky.toSun, earthFullness(dayShare));
    flashBeacons(timestamp);
    sunlit = lunar ? daylight(dayShare) : 1;
    followDaylight(sunlit);
    spaceBase.aimSolarPanels(lunar ? lunarSky.toSun : FIXED_SUN);
  };
  /** Keeps the sky around the eye, so that it looks infinitely far. */
  const followEye = (eye: Object3D) => {
    stars.position.copy(eye.position);
    lunarSky.followEye(eye);
  };
  return {
    ...spaceBase,
    scene,
    showWorld,
    setTime,
    /** How much daylight there is now, from 0 (night) to 1 (noon). */
    daylight: () => sunlit,
    followEye,
    lightAround: lights.around,
    obstacles: [...spaceBase.obstacles, ...rockObstacles(rocks)],
  };
};
