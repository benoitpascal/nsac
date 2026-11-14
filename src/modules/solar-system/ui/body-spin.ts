import { Euler, Quaternion } from 'three';
import {
  EARTH_POLE_ECLIPTIC_LONGITUDE,
  spinAngleAt,
  spinBlurDuring,
  subsolarLongitude,
} from '../core/spin';
import type { Body } from '@/modules/globe/ui/bodies/body';
import type { SimulationClock } from '../core/simulation-clock';
import type { SpinningBodyId } from '../core/spin';
import type { Vector3 } from 'three';

export type SpinTick = {
  clock: SimulationClock;
  simulatedMs: number;
  cloudsOffset: number;
};

export type Spinner = (tick: SpinTick) => void;

const PRIME_MERIDIAN_LONGITUDE = 0;

const spinFrame = (axialTilt: number, yaw: number) =>
  new Quaternion().setFromEuler(new Euler(0, yaw, axialTilt, 'YXZ'));

/** Spin angle bringing the given surface longitude in front of the given world direction. */
const angleFacing = (direction: Vector3, frame: Quaternion, longitude: number) => {
  const local = direction.clone().applyQuaternion(frame.clone().invert());
  return Math.atan2(-local.z, local.x) - longitude;
};

/** Spins the Sun or a planet at its real speed, smeared when too fast to follow. */
export const createFreeSpinner =
  (body: Body, id: SpinningBodyId): Spinner =>
  ({ clock, simulatedMs, cloudsOffset }) => {
    body.update({ surface: spinAngleAt(id, clock.timestamp), cloudsOffset });
    body.setSpinBlur?.(spinBlurDuring(id, simulatedMs));
  };

/**
 * Leans the Earth's pole towards its real direction, then spins the Earth at its real speed,
 * smeared when too fast to follow: the side facing the Sun always matches the simulated time.
 */
export const createEarthSpinner = (
  body: Body,
  axialTilt: number,
  sunDirection: Vector3,
): Spinner => {
  const yaw = EARTH_POLE_ECLIPTIC_LONGITUDE - Math.PI;
  body.root.rotation.y = yaw;
  const frame = spinFrame(axialTilt, yaw);
  return ({ clock, simulatedMs, cloudsOffset }) => {
    body.update({
      surface: angleFacing(sunDirection, frame, subsolarLongitude(clock.timestamp)),
      cloudsOffset,
    });
    body.setSpinBlur?.(spinBlurDuring('earth', simulatedMs));
  };
};

/** Keeps the Moon's near side always turned towards the Earth, wherever it is on its orbit. */
export const createMoonSpinner = (
  body: Body,
  axialTilt: number,
  earthDirection: () => Vector3,
): Spinner => {
  const frame = spinFrame(axialTilt, 0);
  return ({ cloudsOffset }) => {
    body.update({
      surface: angleFacing(earthDirection(), frame, PRIME_MERIDIAN_LONGITUDE),
      cloudsOffset,
    });
  };
};
