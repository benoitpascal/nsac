import type { Mission } from './missions';
import type { MissionTrajectory } from './mission-trajectory';
import type { MissionId } from './spacecraft-ids';
import type { EclipticPosition } from '../orbit';

/** Measured positions of a spacecraft (km, J2000 ecliptic) from the Sun or the Earth. */
export type Ephemeris = {
  missionId: MissionId;
  center: 'sun' | 'earth';
  /** Unix ms, increasing. */
  timestamps: Float64Array;
  /** x, y, z for each timestamp, in the same order. */
  positions: Float64Array;
};

/** Missions whose path comes from NASA/JPL Horizons measurements. */
export const EPHEMERIS_MISSION_IDS: readonly MissionId[] = [
  'curiosity',
  'jwst',
  'voyager-1',
  'voyager-2',
  'cassini',
  'new-horizons',
];

const sampleAt = ({ positions }: Ephemeris, index: number): EclipticPosition => ({
  x: positions[index * 3],
  y: positions[index * 3 + 1],
  z: positions[index * 3 + 2],
});

/** Index of the last sample at or before the time (the time being within the samples). */
const sampleBefore = ({ timestamps }: Ephemeris, timestamp: number) => {
  let [low, high] = [0, timestamps.length - 1];
  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (timestamps[middle] <= timestamp) low = middle;
    else high = middle;
  }
  return low;
};

/**
 * Returns the position at the given time, between the two nearest samples; the first and last
 * samples hold before and after the measurements.
 */
export const ephemerisPositionAt = (ephemeris: Ephemeris, timestamp: number) => {
  const { timestamps } = ephemeris;
  if (timestamps.length === 0) return undefined;
  if (timestamp <= timestamps[0]) return sampleAt(ephemeris, 0);
  const last = timestamps.length - 1;
  if (timestamp >= timestamps[last]) return sampleAt(ephemeris, last);
  const index = sampleBefore(ephemeris, timestamp);
  const [from, to] = [sampleAt(ephemeris, index), sampleAt(ephemeris, index + 1)];
  const share = (timestamp - timestamps[index]) / (timestamps[index + 1] - timestamps[index]);
  return {
    x: from.x + (to.x - from.x) * share,
    y: from.y + (to.y - from.y) * share,
    z: from.z + (to.z - from.z) * share,
  };
};

/** Returns every sample with its time, in order. */
export const ephemerisSamples = (ephemeris: Ephemeris) =>
  Array.from(ephemeris.timestamps, (time, index) => ({
    time,
    position: sampleAt(ephemeris, index),
  }));

/** Returns the mission's trajectory from its measurements, shown only while it flies. */
export const ephemerisTrajectory = (mission: Mission, ephemeris: Ephemeris): MissionTrajectory => {
  const path = ephemerisSamples(ephemeris).map((sample) => sample.position);
  return {
    positionAt: (timestamp) =>
      timestamp < mission.window.start || timestamp > mission.window.end
        ? undefined
        : ephemerisPositionAt(ephemeris, timestamp),
    pathAt: () => path,
    pathChanges: false,
  };
};
