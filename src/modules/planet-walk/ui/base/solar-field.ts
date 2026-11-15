import { Group } from 'three';
import { createSolarTracker } from './solar-tracker.mesh';
import type { SatelliteMaterials } from '@/modules/globe/ui/bodies/satellite/satellite.materials';
import type { Vector3 } from 'three';

/** A row of sun-tracking arrays behind the base (m, from the base center), far enough apart to turn freely. */
const ROW = { count: 7, spacing: 4.5, z: -17 };

/** Builds the base's solar field; `aim` turns every array to face the Sun. */
export const createSolarField = (materials: SatelliteMaterials) => {
  const trackers = Array.from({ length: ROW.count }, (_, index) => {
    const built = createSolarTracker(materials);
    built.tracker.position.set((index - (ROW.count - 1) / 2) * ROW.spacing, 0, ROW.z);
    return built;
  });
  const field = new Group();
  field.add(...trackers.map(({ tracker }) => tracker));
  return {
    field,
    solids: trackers.map(({ solid }) => solid),
    aim: (toSun: Vector3) => {
      for (const { aim } of trackers) aim(toSun);
    },
  };
};
