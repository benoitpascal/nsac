import { PerspectiveCamera } from 'three';
import { FIRST_WORLD_ID, WALK_WORLDS } from '../core/walk-worlds';
import { createAstronautAvatar } from './astronaut/astronaut-avatar';
import { createKeyboardInput } from './controls/keyboard-input';
import { createMissionRun } from './controls/mission-run';
import { createMouseLook } from './controls/mouse-look';
import { createStationControls } from './controls/station-controls';
import { createSuitMonitor } from './controls/suit-monitor';
import { createTouchPad } from './controls/touch-pad';
import { createViewToggle } from './controls/view-toggle';
import { createWalkClock } from './controls/walk-clock';
import { createWalkMap } from './controls/walk-map';
import { createWalkFrame } from './walk-frame';
import { createWalkRenderer } from './walk-renderer';
import { createWalkScene } from './walk-scene';
import type { Obstacle } from '../core/obstacles';
import type { SuitKit } from '../core/suit/suit-supply';
import type { MissionPlan } from './controls/mission-run';
import type { WalkClockElements } from './controls/walk-clock';
import type { WalkMapElements } from './controls/walk-map';
import type { Star } from '@/modules/solar-system/core/star';

export type PlanetWalkElements = {
  canvas: HTMLCanvasElement;
  pilotPrompt: HTMLButtonElement;
  dashboard: HTMLElement;
  touchPad: HTMLElement;
  excavatorHud: HTMLElement;
  suitHud: HTMLElement;
  rescueFade: HTMLElement;
  missionHud: HTMLElement;
  missionFinish: HTMLButtonElement;
  map: WalkMapElements;
  clock: WalkClockElements;
};

/** What the walk needs from outside the page: the star catalog and the time (Unix ms). */
export type PlanetWalkSources = {
  loadStars: () => Promise<Star[]>;
  now: () => number;
  /** What the suit carries: bottles extend its oxygen, extra items make it drain faster. */
  suitKit: SuitKit;
  /** Called once the crew has brought the astronaut back to the base. */
  onRescue: () => void;
  /** The excavator mission to play, when the page is opened for one. */
  mission?: MissionPlan;
};

const MAX_FRAME_SECONDS = 0.1;
/** Ground covered by a building rather than a rock (m²), to keep the map readable. */
const BUILDING_MIN_AREA_M2 = 1.5;

const isBuilding = ({ minX, maxX, minZ, maxZ }: Obstacle) =>
  (maxX - minX) * (maxZ - minZ) >= BUILDING_MIN_AREA_M2;
const MS_PER_SECOND = 1000;
/** Far enough to see the stars, the Sun and the Earth beyond the hills (m). */
const SKY_REACH_M = 6000;

/**
 * Lets the user walk an astronaut on a chosen world, seen from behind or through its eyes, go in
 * and out of the base through its airlock door, read the station dashboard at its terminal and
 * drive the excavator robot from there: keys or on-screen buttons to walk, turn, jump and act (E),
 * dragging to turn and look up or down.
 */
export const mountPlanetWalk = (elements: PlanetWalkElements, sources: PlanetWalkSources) => {
  const renderer = createWalkRenderer(elements.canvas);
  const camera = new PerspectiveCamera(70, 1, 0.05, SKY_REACH_M);
  const world = createWalkScene(renderer, sources.loadStars);
  // The game is played on the Moon: the other worlds of the walk are no longer offered.
  const current =
    WALK_WORLDS.find((candidate) => candidate.id === FIRST_WORLD_ID) ?? WALK_WORLDS[0];
  world.showWorld(current.id);
  createTouchPad(elements.touchPad, window);
  const station = createStationControls(world, elements, () => current.id, sources.now);
  const suit = createSuitMonitor(
    elements.suitHud,
    elements.rescueFade,
    sources.suitKit,
    sources.onRescue,
  );
  const mission =
    sources.mission &&
    createMissionRun(
      sources.mission,
      elements.missionHud,
      elements.missionFinish,
      station.driving,
      station.actions,
      world.digZone,
    );
  const map = createWalkMap(elements.map, world.obstacles.filter(isBuilding), {
    digZone: world.digZone,
    dropZone: world.dropZone,
    hall: world.stationSpots.console,
    robot: station.driving.vehicle,
  });
  const clock = createWalkClock(elements.clock, sources.now);
  const frame = createWalkFrame({
    world,
    camera,
    keyboard: createKeyboardInput(window),
    mouse: createMouseLook(elements.canvas),
    avatar: createAstronautAvatar(world.scene, renderer),
    view: createViewToggle(window),
    ...station,
    suit,
    mission,
    map,
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
    clock.update(world.daylight() > 0);
    renderer.render(world.scene, camera);
  });
};
