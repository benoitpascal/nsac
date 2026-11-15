import { startWalker, stepWalker } from '../core/walker';
import { placeCamera } from './walker-camera';
import { ceilingAt, WALKER_BODY } from '../core/obstacles';
import type { Obstacle } from '../core/obstacles';
import type { Walker } from '../core/walker';
import type { createAstronautAvatar } from './astronaut/astronaut-avatar';
import type { createExcavatorDriving } from './controls/excavator-driving';
import type { createExcavatorHud } from './controls/excavator-hud';
import type { createKeyboardInput } from './controls/keyboard-input';
import type { createMissionRun } from './controls/mission-run';
import type { createMouseLook } from './controls/mouse-look';
import type { createStationActions } from './controls/station-actions';
import type { createSuitMonitor } from './controls/suit-monitor';
import type { createViewToggle } from './controls/view-toggle';
import type { createStationDashboard } from './dashboard/station-dashboard';
import type { createWalkScene } from './walk-scene';
import type { PerspectiveCamera } from 'three';

/** Everything a frame reads and moves. */
export type FrameParts = {
  world: ReturnType<typeof createWalkScene>;
  camera: PerspectiveCamera;
  keyboard: ReturnType<typeof createKeyboardInput>;
  mouse: ReturnType<typeof createMouseLook>;
  avatar: ReturnType<typeof createAstronautAvatar>;
  view: ReturnType<typeof createViewToggle>;
  actions: ReturnType<typeof createStationActions>;
  driving: ReturnType<typeof createExcavatorDriving>;
  dashboard: ReturnType<typeof createStationDashboard>;
  hud: ReturnType<typeof createExcavatorHud>;
  suit: ReturnType<typeof createSuitMonitor>;
  mission?: ReturnType<typeof createMissionRun>;
  gravity: () => number;
};

const STAND_STILL = { forward: 0, run: false, turn: 0, jump: false, turnBy: 0 };

const walkerObstacle = ({ x, z, height }: Walker): Obstacle => ({
  minX: x - WALKER_BODY.radius,
  maxX: x + WALKER_BODY.radius,
  minZ: z - WALKER_BODY.radius,
  maxZ: z + WALKER_BODY.radius,
  bottom: height,
  top: height + WALKER_BODY.height,
});

/**
 * Returns the step run on every frame: the keys and the mouse move the astronaut, or the
 * excavator robot while it is driven and powered, and nothing while the dashboard is read; each
 * bumps into the other; the camera follows the one being driven.
 */
export const createWalkFrame = (parts: FrameParts) => {
  const { world, camera, keyboard, mouse, avatar, view, actions, driving } = parts;
  let walker = startWalker();
  let cameraDistance = Infinity;
  return (seconds: number) => {
    const moves = { ...keyboard.read(), turnBy: mouse.takeTurn() };
    const activity = actions.activity();
    const drivingRobot = activity === 'driving';
    const withRobot = [...world.obstacles, driving.obstacle()];
    const walking = activity === 'walking' ? moves : STAND_STILL;
    walker = actions.update(stepWalker(walker, walking, parts.gravity(), seconds, withRobot));
    driving.update(seconds, drivingRobot, drivingRobot ? moves : STAND_STILL, [
      ...world.obstacles,
      walkerObstacle(walker),
    ]);
    if (drivingRobot && !driving.hasCharge()) actions.stopDriving();
    parts.hud.update(seconds, drivingRobot);
    parts.dashboard.update(seconds, driving.isDigging());
    const underRoof = ceilingAt(world.obstacles, walker, walker.height) < Infinity;
    const effort = drivingRobot
      ? 'action'
      : moves.forward === 0
        ? 'rest'
        : moves.run
          ? 'run'
          : 'walk';
    const rescued = parts.suit.update(seconds, effort, !underRoof);
    parts.mission?.update(seconds, !underRoof, rescued);
    if (rescued) {
      actions.stopDriving();
      walker = startWalker();
    }
    const lamp = underRoof ? 0 : (1 - world.daylight()) ** 2;
    avatar.follow(walker, drivingRobot || view.mode() === 'third', lamp, seconds, parts.gravity());
    const followed = drivingRobot ? { ...driving.vehicle(), height: 0, verticalSpeed: 0 } : walker;
    const [mode, walls] = drivingRobot
      ? (['third', world.obstacles] as const)
      : [view.mode(), withRobot];
    const previous = { distance: cameraDistance, seconds };
    cameraDistance = placeCamera(camera, followed, mouse.pitch(), mode, walls, previous);
    world.followEye(camera);
    world.lightAround(followed);
  };
};
