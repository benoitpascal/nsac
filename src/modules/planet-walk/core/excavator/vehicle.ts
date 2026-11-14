import { freeSpot } from '../obstacles';
import type { Body, Obstacle } from '../obstacles';

/** A ground robot: where it is (m) and which way it faces (radians, 0 looking along -z). */
export type Vehicle = { x: number; z: number; heading: number };

/**
 * Driving wishes: forward (1) or back (-1), keep turning right (1) or left (-1), turn at once,
 * and dig.
 */
export type DriveInput = { forward: number; turn: number; turnBy: number; dig: boolean };

/** The excavator robot seen as a round body, drums included. */
export const EXCAVATOR_BODY: Body = { radius: 1.1, height: 1.2 };
/** Driving speed (m/s) and turning speed (radians per second) of the excavator. */
const DRIVE = { speed: 1.2, turn: 0.8 };

/**
 * Returns the vehicle after the given time: it turns, then drives unless something blocks it.
 * While digging it stands on its drums with its wheels off the ground, so it neither drives
 * nor turns.
 */
export const stepVehicle = (
  vehicle: Vehicle,
  input: DriveInput,
  seconds: number,
  obstacles: readonly Obstacle[],
): Vehicle => {
  if (input.dig) return vehicle;
  const heading = vehicle.heading - input.turn * DRIVE.turn * seconds - input.turnBy;
  const step = DRIVE.speed * input.forward * seconds;
  const wanted = {
    x: vehicle.x - Math.sin(heading) * step,
    z: vehicle.z - Math.cos(heading) * step,
  };
  return { ...freeSpot(obstacles, vehicle, wanted, 0, EXCAVATOR_BODY), heading };
};

/** Returns the box the vehicle fills, for the walker to bump into. */
export const vehicleObstacle = ({ x, z }: Vehicle): Obstacle => ({
  minX: x - EXCAVATOR_BODY.radius,
  maxX: x + EXCAVATOR_BODY.radius,
  minZ: z - EXCAVATOR_BODY.radius,
  maxZ: z + EXCAVATOR_BODY.radius,
  bottom: 0,
  top: EXCAVATOR_BODY.height,
});
