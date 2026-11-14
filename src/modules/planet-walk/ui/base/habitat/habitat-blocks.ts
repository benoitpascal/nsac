import { HATCH, MODULE } from './habitat-dimensions';
import type { HabitatBlock, ModuleEnds } from './habitat-dimensions';

const { radius: R, axisHeight: AXIS } = MODULE;
/** Half width of the floor, where the curved hull meets the ground (m). */
const FLOOR_HALF = Math.sqrt(R * R - AXIS * AXIS);
const SIDE_WIDTH = 1.4;
const SIDE_X = FLOOR_HALF + SIDE_WIDTH / 2;
const TOP = AXIS + R;
const CEILING = 3.7;
const END = 0.3;
const HATCH_SIDE_WIDTH = R - HATCH.width / 2;
const HATCH_SIDE_X = (HATCH.width + HATCH_SIDE_WIDTH) / 2;

/** Collision boxes of an end wall or a wall across the module at the given z: whole, or around a hatch. */
// prettier-ignore
export const endBlocks = (z: number, withHatch: boolean): HabitatBlock[] =>
  withHatch
    ? [
        { x: -HATCH_SIDE_X, z, width: HATCH_SIDE_WIDTH, depth: END, bottom: 0, top: TOP },
        { x: HATCH_SIDE_X, z, width: HATCH_SIDE_WIDTH, depth: END, bottom: 0, top: TOP },
        { x: 0, z, width: HATCH.width, depth: END, bottom: HATCH.height, top: TOP },
      ]
    : [{ x: 0, z, width: 2 * R, depth: END, bottom: 0, top: TOP }];

/**
 * Returns the collision boxes approaching the round hull: side walls from where the hull meets
 * the floor, a flat ceiling under the top, and both ends, whole or around their hatch, for a module
 * of the given length (m).
 */
// prettier-ignore
export const habitatBlocks = (ends: ModuleEnds, length: number): HabitatBlock[] => [
  { x: -SIDE_X, z: 0, width: SIDE_WIDTH, depth: length, bottom: 0, top: TOP },
  { x: SIDE_X, z: 0, width: SIDE_WIDTH, depth: length, bottom: 0, top: TOP },
  { x: 0, z: 0, width: 2 * R, depth: length, bottom: CEILING, top: TOP },
  ...endBlocks(-length / 2, ends.back),
  ...endBlocks(length / 2, ends.front),
];
