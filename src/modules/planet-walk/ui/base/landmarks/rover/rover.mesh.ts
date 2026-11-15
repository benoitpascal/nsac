import { Group } from 'three';
import { createRoverCabin } from './rover-cabin';
import { box, CABIN, ROVER_MATERIALS } from './rover-parts';
import { createRoverRoof } from './rover-roof';
import { createRoverWheels } from './rover-wheels';

/**
 * Builds a pressurized crew rover like the ones planned for Artemis: a white cabin with a big
 * sloping windscreen, side windows, an orange stripe and suit hatches at the back, roof gear,
 * and six big wheels on a dark chassis. Its front faces +z.
 */
export const createRover = () => {
  const chassis = box(
    [2.2, 0.35, CABIN.nose - CABIN.back],
    [0, CABIN.bottom - 0.1, (CABIN.nose + CABIN.back) / 2],
    ROVER_MATERIALS.dark,
  );
  const rover = new Group();
  rover.add(chassis, createRoverCabin(), createRoverRoof(), createRoverWheels());
  return rover;
};
