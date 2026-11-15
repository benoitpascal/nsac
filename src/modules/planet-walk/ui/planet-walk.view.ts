import { PerspectiveCamera } from 'three';
import { FIRST_WORLD_ID, WALK_WORLDS } from '../core/walk-worlds';
import { createAstronautAvatar } from './astronaut/astronaut-avatar';
import { createKeyboardInput } from './controls/keyboard-input';
import { createMouseLook } from './controls/mouse-look';
import { createStationControls } from './controls/station-controls';
import { createTouchPad } from './controls/touch-pad';
import { createViewToggle } from './controls/view-toggle';
import { showJumpFacts } from './jump-facts.view';
import { createWalkFrame } from './walk-frame';
import { createWalkRenderer } from './walk-renderer';
import { createWalkScene } from './walk-scene';
import { mountWorldPicker } from './world-picker.view';
import type { Star } from '@/modules/solar-system/core/star';

export type PlanetWalkElements = {
  canvas: HTMLCanvasElement;
  worldPicker: HTMLElement;
  factsPanel: HTMLElement;
  viewToggle: HTMLButtonElement;
  pilotPrompt: HTMLButtonElement;
  dashboard: HTMLElement;
  touchPad: HTMLElement;
  excavatorHud: HTMLElement;
};

/** What the walk needs from outside the page: the star catalog and the time (Unix ms). */
export type PlanetWalkSources = {
  loadStars: () => Promise<Star[]>;
  now: () => number;
};

const MAX_FRAME_SECONDS = 0.1;
const MS_PER_SECOND = 1000;
/** Far enough to see the stars, the Sun and the Earth beyond the hills (m). */
const SKY_REACH_M = 6000;

/**
 * Lets the user walk an astronaut on a chosen world, seen from behind or through its eyes, go in
 * and out of the base through its airlock door, read the station dashboard at its terminal and
 * drive the excavator robot from there: keys or on-screen buttons to walk, turn, jump and act (E),
 * dragging to turn and look up or down, and a panel telling how the world's gravity changes a jump.
 */
export const mountPlanetWalk = (elements: PlanetWalkElements, sources: PlanetWalkSources) => {
  const renderer = createWalkRenderer(elements.canvas);
  const camera = new PerspectiveCamera(70, 1, 0.05, SKY_REACH_M);
  const world = createWalkScene(renderer, sources.loadStars);
  let current = WALK_WORLDS.find((candidate) => candidate.id === FIRST_WORLD_ID) ?? WALK_WORLDS[0];
  const choose = (next: typeof current) => {
    current = next;
    world.showWorld(next.id);
    showJumpFacts(elements.factsPanel, next);
  };
  mountWorldPicker(elements.worldPicker, current.id, choose);
  choose(current);
  createTouchPad(elements.touchPad, window);
  const frame = createWalkFrame({
    world,
    camera,
    keyboard: createKeyboardInput(window),
    mouse: createMouseLook(elements.canvas),
    avatar: createAstronautAvatar(world.scene, renderer),
    view: createViewToggle(elements.viewToggle, window),
    ...createStationControls(world, elements, () => current.id, sources.now),
    gravity: () => current.gravity,
  });
  new ResizeObserver(() => {
    const { clientWidth, clientHeight } = elements.canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / Math.max(clientHeight, 1);
    camera.updateProjectionMatrix();
  }).observe(elements.canvas);
  let previous = performance.now();
  renderer.setAnimationLoop((time: number) => {
    frame(Math.min((time - previous) / MS_PER_SECOND, MAX_FRAME_SECONDS));
    previous = time;
    world.setTime(sources.now());
    renderer.render(world.scene, camera);
  });
};
