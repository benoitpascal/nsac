export type CelestialBodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'communication-satellite'
  | 'navigation-satellite'
  | 'weather-satellite'
  | 'radar-satellite'
  | 'space-telescope'
  | 'space-station'
  | 'cubesat'
  | 'space-probe'
  | 'solar-panel'
  | 'battery'
  | 'oxygen-tanks'
  | 'electrolyzer'
  | 'rations'
  | 'greenhouse'
  | 'water-tank'
  | 'lab'
  | 'relay-antenna'
  | 'habitat-module';

export type CelestialBody = {
  id: CelestialBodyId;
  name: string;
  axialTilt: number;
};

export type BodyCatalog = {
  bodies: readonly CelestialBody[];
  initialIndex: number;
};

export type SwitchStep = 1 | -1;

/**
 * Returns the index of the body reached by moving one step from the given index
 * in the catalog, wrapping around both ends of the list.
 */
export const cycleBodyIndex = (catalog: BodyCatalog, index: number, step: SwitchStep): number =>
  (index + step + catalog.bodies.length) % catalog.bodies.length;
