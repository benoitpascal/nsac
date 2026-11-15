import { SpotLight } from 'three';
import type { Walker } from '../../core/walker';
import type { Scene } from 'three';

/**
 * The helmet lamps, as one beam: spacewalk suits carry lights on the helmet to work in the dark.
 * Placed at the helmet, aiming a few steps ahead on the ground (m, radians, candela).
 */
const LAMP = {
  height: 1.75,
  ahead: 0.1,
  aimAhead: 7,
  intensity: 90,
  reach: 40,
  angle: 0.55,
  penumbra: 0.45,
  color: 0xf4f6ff,
  /** Share of the way to on or off covered each frame, so that it fades instead of blinking. */
  fade: 0.12,
};

/**
 * Creates the helmet lamp in the scene, following the walker's head even when the astronaut is
 * not drawn (first-person view), so that the way ahead stays lit during the lunar night. It is
 * switched off in daylight and under a roof, where the base's own lamps light the way.
 */
export const createHeadlamp = (scene: Scene) => {
  const beam = new SpotLight(LAMP.color, LAMP.intensity, LAMP.reach, LAMP.angle, LAMP.penumbra);
  scene.add(beam, beam.target);
  return {
    /** Follows the walker's head, the lamp lit to the given share (0 off, 1 full). */
    follow: ({ x, z, height, heading }: Walker, lit: number) => {
      const wanted = lit * LAMP.intensity;
      beam.intensity += (wanted - beam.intensity) * LAMP.fade;
      const [forwardX, forwardZ] = [-Math.sin(heading), -Math.cos(heading)];
      beam.position.set(x + forwardX * LAMP.ahead, height + LAMP.height, z + forwardZ * LAMP.ahead);
      beam.target.position.set(x + forwardX * LAMP.aimAhead, height, z + forwardZ * LAMP.aimAhead);
    },
  };
};
