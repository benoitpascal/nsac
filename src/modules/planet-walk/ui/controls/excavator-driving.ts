import { steerWith } from '../../core/excavator/control-scramble';
import { insideZone } from '../../core/excavator/ground-zone';
import { startStorm, stepStorm } from '../../core/excavator/magnetic-storm';
import {
  EXCAVATOR,
  hasCharge,
  isFull,
  startExcavatorStore,
  stepExcavatorStore,
} from '../../core/excavator/excavator-power';
import { stepVehicle, vehicleObstacle } from '../../core/excavator/vehicle';
import type { GroundZone } from '../../core/excavator/ground-zone';
import type { DrumRates, ExcavatorStore } from '../../core/excavator/excavator-power';
import type { DriveInput, Vehicle } from '../../core/excavator/vehicle';
import type { Obstacle, Spot } from '../../core/obstacles';
import type { ExcavatorControls } from '../base/excavator/excavator-site';

export type ExcavatorDrivingSetup = {
  excavator: ExcavatorControls;
  /** Where the dig site stands in the world, the robot's starting spot. */
  digSite: Spot;
  /** Where in the world the robot may dig, and where it drops off what it dug. */
  digZone: GroundZone;
  dropZone: GroundZone;
  /** Grows the drop-off pile to the regolith dropped off so far (kg). */
  fillDropSite: (deliveredKg: number) => void;
};

/** Where the robot stands: in the dig zone, the drop-off zone, or elsewhere. */
export type RobotPlace = 'dig' | 'drop' | 'elsewhere';

/** The robot starts facing +x, along its dug patch. */
const START_HEADING = -Math.PI / 2;

/**
 * Moves the excavator robot while it is driven: the keys roll and turn it, Space digs in the dig
 * zone until its drums are full and empties them in the drop-off zone. Rolling, turning and
 * running the drums drain its battery, and an empty battery stops it for good. Once it carries
 * enough regolith, a magnetic storm scrambles its Z Q S D keys for a while.
 */
export const createExcavatorDriving = (setup: ExcavatorDrivingSetup) => {
  let vehicle: Vehicle = { ...setup.digSite, heading: START_HEADING };
  let store: ExcavatorStore = startExcavatorStore();
  let drums: DrumRates = EXCAVATOR;
  let digging = false;
  let storm = startStorm();
  const place = (): RobotPlace => {
    if (insideZone(setup.digZone, vehicle)) return 'dig';
    return insideZone(setup.dropZone, vehicle) ? 'drop' : 'elsewhere';
  };
  return {
    /** The robot, as something to bump into. */
    obstacle: (): Obstacle => vehicleObstacle(vehicle),
    vehicle: () => vehicle,
    store: () => store,
    storm: () => storm,
    isDigging: () => digging,
    /** Fits the drums and adds spare batteries (kWh) for a mission. */
    equip: (fitted: DrumRates, extraKwh: number) => {
      drums = fitted;
      store = { ...store, batteryKwh: store.batteryKwh + extraKwh };
    },
    hasCharge: () => hasCharge(store),
    place,
    /** Moves the robot when driven and powered, drains its battery, and animates its wheels and drums. */
    update: (
      seconds: number,
      driven: boolean,
      input: Omit<DriveInput, 'dig'> & { jump: boolean },
      obstacles: readonly Obstacle[],
    ) => {
      const before = vehicle;
      const spinning = driven && hasCharge(store) && input.jump;
      digging = spinning && place() === 'dig' && !isFull(store);
      const unloading = spinning && place() === 'drop' && store.carriedKg > 0;
      const working = digging || unloading;
      const steering = steerWith(storm.controls, input);
      if (driven && hasCharge(store))
        vehicle = stepVehicle(vehicle, { ...input, ...steering, dig: working }, seconds, obstacles);
      const moved = Math.hypot(vehicle.x - before.x, vehicle.z - before.z);
      const moving = moved > 0 || vehicle.heading !== before.heading;
      store = stepExcavatorStore(store, { moving, digging, unloading }, seconds, drums);
      storm = stepStorm(storm, store.carriedKg, seconds, Math.random);
      if (unloading) setup.fillDropSite(store.deliveredKg);
      const rolled = steering.forward < 0 ? -moved : moved;
      setup.excavator.place(
        vehicle.x - setup.digSite.x,
        vehicle.z - setup.digSite.z,
        vehicle.heading,
      );
      setup.excavator.animate(seconds, { digging: working, rolled });
    },
  };
};
