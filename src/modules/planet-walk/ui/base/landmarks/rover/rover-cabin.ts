import { Group } from 'three';
import { suitHatch, windscreen } from './rover-cabin-details';
import { box, CABIN, NOSE_HEIGHT, ROVER_MATERIALS, softBox } from './rover-parts';
import type { Mesh } from 'three';
import type { Triple } from './rover-parts';

const TOP = CABIN.bottom + CABIN.height;

const sides = (make: (side: number) => Mesh[]) => [-1, 1].flatMap(make);
const onSide = (
  side: number,
  y: number,
  z: number,
  size: Triple,
  material = ROVER_MATERIALS.glass,
) => box(size, [side * (CABIN.width / 2 + 0.01), y, z], material);

/**
 * Builds the rover's pressurized cabin: a white body with a lower nose and a big sloping
 * windscreen at the front (+z), side windows, an orange stripe, headlights, and two suit hatches
 * at the back.
 */
export const createRoverCabin = () => {
  const length = CABIN.windscreen - CABIN.back;
  const cabin = new Group();
  cabin.add(
    softBox(
      [CABIN.width, CABIN.height, length],
      0.3,
      [0, CABIN.bottom + CABIN.height / 2, (CABIN.windscreen + CABIN.back) / 2],
      ROVER_MATERIALS.white,
    ),
    softBox(
      [CABIN.width, NOSE_HEIGHT, CABIN.nose - CABIN.windscreen + 0.3],
      0.2,
      [0, CABIN.bottom + NOSE_HEIGHT / 2, (CABIN.nose + CABIN.windscreen) / 2 - 0.15],
      ROVER_MATERIALS.white,
    ),
    windscreen(),
    ...sides((side) => [
      onSide(side, TOP - 0.7, 1.0, [0.04, 0.6, 0.9]),
      onSide(side, TOP - 0.7, -0.1, [0.04, 0.6, 0.9]),
      onSide(
        side,
        CABIN.bottom + 0.55,
        (CABIN.nose + CABIN.back) / 2,
        [0.04, 0.16, CABIN.nose - CABIN.back - 0.4],
        ROVER_MATERIALS.stripe,
      ),
      box(
        [0.4, 0.14, 0.05],
        [side * 0.85, CABIN.bottom + 0.75, CABIN.nose + 0.02],
        ROVER_MATERIALS.light,
      ),
    ]),
    suitHatch(-0.6),
    suitHatch(0.6),
  );
  return cabin;
};
