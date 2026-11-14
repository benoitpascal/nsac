import type { Spinner } from './body-spin';
import type { ScaleMode } from './nodes/display-scale';
import type { FocusTarget } from './nodes/focus-target';
import type { PlanetNode } from './nodes/planet.node';
import type { SpacecraftLayer } from './spacecraft/spacecraft-layer';
import type { SunNode } from './nodes/sun.node';

/** The Sun, the planets, the Moon and the spacecraft, ready to be added to the scene. */
export type SolarSystemBodies = {
  sun: SunNode;
  planets: PlanetNode[];
  spinners: Spinner[];
  spacecraft: SpacecraftLayer;
  /** Every body the camera can fly to, from the Sun outwards. */
  focusTargets: FocusTarget[];
  /** Moves the planets and the Moon to where they are at the given time, with eclipse shadows. */
  placeAt: (timestamp: number) => void;
  /** Shows every body at its size and distance for the given scale. */
  setScaleMode: (mode: ScaleMode) => void;
};
