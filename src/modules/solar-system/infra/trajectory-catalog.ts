import type { Ephemeris } from '../core/spacecraft/ephemeris';
import type { MissionId } from '../core/spacecraft/spacecraft-ids';

type TrajectoryFile = { center?: unknown; samples?: unknown };

const FIELDS_PER_SAMPLE = 4;
const fileUrl = (id: MissionId) => `/data/trajectories/${id}.json`;

const isNumberList = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));

/** Checks the file and splits its flat samples into times and positions. */
const parseTrajectory = (missionId: MissionId, file: TrajectoryFile): Ephemeris => {
  const { center, samples } = file;
  if (center !== 'sun' && center !== 'earth') throw new Error('unknown center');
  if (!isNumberList(samples) || samples.length % FIELDS_PER_SAMPLE !== 0)
    throw new Error('samples are not rows of [time, x, y, z] numbers');
  const count = samples.length / FIELDS_PER_SAMPLE;
  const timestamps = new Float64Array(count);
  const positions = new Float64Array(count * 3);
  for (let index = 0; index < count; index++) {
    const row = index * FIELDS_PER_SAMPLE;
    if (index > 0 && samples[row] <= timestamps[index - 1])
      throw new Error('times are not increasing');
    timestamps[index] = samples[row];
    positions.set(samples.slice(row + 1, row + FIELDS_PER_SAMPLE), index * 3);
  }
  return { missionId, center, timestamps, positions };
};

const loadTrajectory = async (missionId: MissionId): Promise<Ephemeris> => {
  const response = await fetch(fileUrl(missionId));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return parseTrajectory(missionId, (await response.json()) as TrajectoryFile);
};

/**
 * Loads the measured trajectories of the given missions (from NASA/JPL Horizons). A missing or
 * invalid file is left out with a warning, so that the page still works without it.
 */
export const loadTrajectories = async (missionIds: readonly MissionId[]): Promise<Ephemeris[]> => {
  const results = await Promise.allSettled(missionIds.map(loadTrajectory));
  return results.flatMap((result, index) => {
    if (result.status === 'fulfilled') return [result.value];
    console.warn('Trajectory unavailable', {
      missionId: missionIds[index],
      reason: String(result.reason),
    });
    return [];
  });
};
