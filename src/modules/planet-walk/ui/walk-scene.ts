import { AmbientLight, DirectionalLight, HemisphereLight, Scene } from 'three';
import { createGround } from './terrain/ground.mesh';
import { layOutRocks, rockObstacles } from './terrain/rock-layout';
import { createRocks } from './terrain/rocks.mesh';
import { createStars, paintSky } from './terrain/sky';
import { BASE_SITE } from './base/base-layout';
import { createSpaceBase } from './base/space-base';
import { WORLD_APPEARANCES } from './world-appearance';
import type { WalkWorldId } from '../core/walk-worlds';
import type { Mesh, Object3D, WebGLRenderer } from 'three';

const SKY_GLOW = 0.6;
/** Where the sunlight comes from, relative to the walker (m). */
const SUN_OFFSET = { x: -40, y: 60, z: 20 };
/** Shadows are drawn only near the walker, sharp enough for the astronaut. */
const SHADOW = {
  mapSize: 2048,
  bounds: { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 200 },
};
/** Soft light so that sides in the shade stay readable, even without air to scatter sunlight. */
const SHADE_LIGHT = 0.5;

const disposeMesh = (mesh: Mesh) => {
  mesh.geometry.dispose();
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  for (const material of materials) material.dispose();
};

/**
 * The ground, rocks, sky and sunlight around the walker, switched from one world to another,
 * with a space base standing ahead of the start.
 */
export const createWalkScene = (renderer: WebGLRenderer) => {
  const scene = new Scene();
  const sun = new DirectionalLight(0xffffff, 1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(SHADOW.mapSize, SHADOW.mapSize);
  Object.assign(sun.shadow.camera, SHADOW.bounds);
  scene.add(sun.target);
  const skyLight = new HemisphereLight(0xffffff, 0x222222, SKY_GLOW);
  const stars = createStars();
  const spaceBase = createSpaceBase(renderer);
  const rocks = layOutRocks(BASE_SITE);
  scene.add(sun, skyLight, new AmbientLight(0xffffff, SHADE_LIGHT), stars, spaceBase.base);
  let surface: Mesh[] = [];
  const showWorld = (id: WalkWorldId) => {
    const appearance = WORLD_APPEARANCES[id];
    for (const mesh of surface) {
      scene.remove(mesh);
      disposeMesh(mesh);
    }
    surface = [createGround(appearance), createRocks(appearance.rock, rocks)];
    scene.add(...surface);
    paintSky(scene, appearance);
    sun.intensity = appearance.sunlight;
    skyLight.color.set(appearance.sky);
    stars.visible = appearance.stars;
  };
  /** Keeps the stars around the eye, so that they look infinitely far. */
  const followEye = (eye: Object3D) => stars.position.copy(eye.position);
  /** Keeps the sunlight and its shadows centered on the walker. */
  const lightAround = (spot: { x: number; z: number }) => {
    sun.position.set(spot.x + SUN_OFFSET.x, SUN_OFFSET.y, spot.z + SUN_OFFSET.z);
    sun.target.position.set(spot.x, 0, spot.z);
  };
  /** Everything the walker bumps into or climbs on. */
  const obstacles = [...spaceBase.obstacles, ...rockObstacles(rocks)];
  return {
    scene,
    showWorld,
    followEye,
    lightAround,
    obstacles,
    excavator: spaceBase.excavator,
    digSite: spaceBase.digSite,
    digZone: spaceBase.digZone,
    dropZone: spaceBase.dropZone,
    fillDropSite: spaceBase.fillDropSite,
    stationSpots: spaceBase.stationSpots,
  };
};
