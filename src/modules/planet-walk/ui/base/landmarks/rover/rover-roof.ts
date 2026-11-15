import { CylinderGeometry, Group, Mesh, SphereGeometry } from 'three';
import { box, CABIN, ROVER_MATERIALS } from './rover-parts';

const TOP = CABIN.bottom + CABIN.height;

/** A small dish antenna looking up and forward. */
const dish = () => {
  const bowl = new Mesh(
    new SphereGeometry(0.32, 20, 10, 0, Math.PI * 2, 0, Math.PI / 3),
    ROVER_MATERIALS.white,
  );
  bowl.rotation.x = Math.PI + 0.6;
  bowl.position.set(-0.8, TOP + 0.45, 1.1);
  const stand = new Mesh(new CylinderGeometry(0.04, 0.04, 0.4, 8), ROVER_MATERIALS.metal);
  stand.position.set(-0.8, TOP + 0.2, 1.1);
  return [stand, bowl];
};

/** Builds the roof gear: a solar panel on a rack, two rails, a whip antenna and a dish. */
export const createRoverRoof = () => {
  const roof = new Group();
  const mast = new Mesh(new CylinderGeometry(0.02, 0.03, 1.1, 8), ROVER_MATERIALS.metal);
  mast.position.set(0.9, TOP + 0.55, 1.2);
  roof.add(
    box([2.1, 0.06, 2.2], [0, TOP + 0.12, -1.2], ROVER_MATERIALS.panel),
    box([2.2, 0.08, 0.08], [0, TOP + 0.06, -0.08], ROVER_MATERIALS.metal),
    box([2.2, 0.08, 0.08], [0, TOP + 0.06, -2.32], ROVER_MATERIALS.metal),
    ...[-1, 1].map((side) =>
      box([0.06, 0.08, 4.2], [side * 1.15, TOP + 0.04, -0.6], ROVER_MATERIALS.metal),
    ),
    mast,
    ...dish(),
  );
  return roof;
};
