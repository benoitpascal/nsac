import { createAstronaut } from './astronaut.mesh';
import { createHeadlamp } from './headlamp';
import type { Walker } from '../../core/walker';
import type { Scene, WebGLRenderer } from 'three';

const STRIDE_M = 0.85;
const FULL_TURN = Math.PI * 2;
const WALK = { hip: 0.5, knee: 0.75, shoulder: 0.35, elbow: 0.35, bob: 0.025 };
const AIR = { hip: 0.45, knee: 0.9, spread: 0.55, elbow: 0.6 };

/**
 * Shows the walker as an astronaut standing where the walker is and facing the same way: a
 * stride swings the legs, bends the knees and swings the arms the other way with the body
 * bobbing; in the air the knees tuck and the arms spread.
 */
export const createAstronautAvatar = (scene: Scene, renderer: WebGLRenderer) => {
  const { astronaut, body, arms, legs } = createAstronaut(renderer);
  scene.add(astronaut);
  const headlamp = createHeadlamp(scene);
  let phase = 0;
  let last = { x: 0, z: 0 };
  return {
    follow: (walker: Walker, visible: boolean, lamp: number) => {
      astronaut.visible = visible;
      headlamp.follow(walker, lamp);
      astronaut.position.set(walker.x, walker.height, walker.z);
      astronaut.rotation.y = walker.heading;
      const airborne = walker.verticalSpeed !== 0;
      const moved = Math.hypot(walker.x - last.x, walker.z - last.z);
      last = { x: walker.x, z: walker.z };
      const walking = moved > 0 && !airborne;
      if (walking) phase = (phase + (moved / STRIDE_M) * Math.PI) % FULL_TURN;
      const swing = walking ? Math.sin(phase) : 0;
      body.position.y = walking ? Math.abs(Math.cos(phase)) * WALK.bob : 0;
      legs.forEach(({ root, joint }, index) => {
        const stride = index === 0 ? swing : -swing;
        root.rotation.x = airborne ? AIR.hip : stride * WALK.hip;
        joint.rotation.x = airborne ? -AIR.knee : -Math.max(0, -stride) * WALK.knee;
      });
      arms.forEach(({ root, joint }, index) => {
        const side = index === 0 ? -1 : 1;
        root.rotation.x = airborne ? 0 : (index === 0 ? -swing : swing) * WALK.shoulder;
        root.rotation.z = side * (airborne ? AIR.spread : 0.1);
        joint.rotation.x = airborne ? AIR.elbow : WALK.elbow;
      });
    },
  };
};
