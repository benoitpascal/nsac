import type { EclipticPosition } from '../orbit';

/**
 * Where a mission's spacecraft is, in km from the center of its frame (J2000 ecliptic).
 * Positions exist only while the mission flies.
 */
export type MissionTrajectory = {
  positionAt: (timestamp: number) => EclipticPosition | undefined;
  /** Points of the drawn path at the given time. */
  pathAt: (timestamp: number) => EclipticPosition[];
  /** Whether the drawn path changes with time (a slowly turning orbit) or stays the same. */
  pathChanges: boolean;
};
