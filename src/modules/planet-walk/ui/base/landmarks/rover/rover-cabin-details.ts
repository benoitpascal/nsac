import { ExtrudeGeometry, Group, Mesh, Shape, TorusGeometry } from 'three';
import { CABIN, NOSE_HEIGHT, ROVER_MATERIALS, softBox } from './rover-parts';

const TOP = CABIN.bottom + CABIN.height;

/** The big sloping windscreen, a wedge from the top of the nose up to the cabin roof. */
export const windscreen = () => {
  const run = CABIN.nose - CABIN.windscreen;
  const outline = new Shape()
    .moveTo(0, 0)
    .lineTo(run, 0)
    .lineTo(0, TOP - CABIN.bottom - NOSE_HEIGHT)
    .closePath();
  const wedge = new Mesh(
    new ExtrudeGeometry(outline, { depth: CABIN.width - 0.06, bevelEnabled: false }),
    ROVER_MATERIALS.glass,
  );
  wedge.rotation.y = -Math.PI / 2;
  wedge.position.set(CABIN.width / 2 - 0.03, CABIN.bottom + NOSE_HEIGHT, CABIN.windscreen);
  return wedge;
};

/** A round suit hatch on the back, where astronauts step into their suits from inside. */
export const suitHatch = (x: number) => {
  const hatch = new Group();
  const ring = new Mesh(new TorusGeometry(0.45, 0.06, 10, 32), ROVER_MATERIALS.metal);
  hatch.add(ring, softBox([0.75, 0.75, 0.04], 0.3, [0, 0, -0.02], ROVER_MATERIALS.dark));
  hatch.position.set(x, CABIN.bottom + 1.15, CABIN.back - 0.03);
  return hatch;
};
