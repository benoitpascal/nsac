import type { BodyCatalog, CelestialBody } from './bodies';

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const PLANET_BODIES: readonly CelestialBody[] = [
  { id: 'sun', name: 'Sun', axialTilt: toRadians(7.25) },
  { id: 'mercury', name: 'Mercury', axialTilt: toRadians(0.03) },
  { id: 'venus', name: 'Venus', axialTilt: toRadians(177.4) },
  { id: 'earth', name: 'Earth', axialTilt: toRadians(23.44) },
  { id: 'moon', name: 'Moon', axialTilt: toRadians(6.68) },
  { id: 'mars', name: 'Mars', axialTilt: toRadians(25.19) },
  { id: 'jupiter', name: 'Jupiter', axialTilt: toRadians(3.13) },
  { id: 'saturn', name: 'Saturn', axialTilt: toRadians(26.73) },
  { id: 'uranus', name: 'Uranus', axialTilt: toRadians(97.77) },
  { id: 'neptune', name: 'Neptune', axialTilt: toRadians(28.32) },
];

/** The Sun, the planets and the Moon, ordered outwards from the Sun, starting on the Earth. */
export const PLANETS: BodyCatalog = {
  bodies: PLANET_BODIES,
  initialIndex: PLANET_BODIES.findIndex((body) => body.id === 'earth'),
};

/** Artificial satellites, starting on the communication satellite. */
export const SATELLITES: BodyCatalog = {
  bodies: [
    { id: 'communication-satellite', name: 'Comms satellite', axialTilt: toRadians(18) },
    { id: 'navigation-satellite', name: 'GPS satellite', axialTilt: toRadians(15) },
    { id: 'weather-satellite', name: 'Weather satellite', axialTilt: toRadians(10) },
    { id: 'radar-satellite', name: 'Radar satellite', axialTilt: toRadians(16) },
    { id: 'space-telescope', name: 'Space telescope', axialTilt: toRadians(12) },
    { id: 'space-station', name: 'Space station', axialTilt: toRadians(14) },
    { id: 'cubesat', name: 'CubeSat', axialTilt: toRadians(20) },
    { id: 'space-probe', name: 'Space probe', axialTilt: toRadians(12) },
  ],
  initialIndex: 0,
};

/** Mission equipment shown on its own, grouped by energy, life support, shielding and science. */
export const EQUIPMENT: BodyCatalog = {
  bodies: [
    { id: 'solar-panel', name: 'Solar panel', axialTilt: toRadians(20) },
    { id: 'battery', name: 'Battery', axialTilt: toRadians(10) },
    { id: 'oxygen-tanks', name: 'Oxygen tanks', axialTilt: toRadians(15) },
    { id: 'electrolyzer', name: 'Electrolyzer', axialTilt: toRadians(12) },
    { id: 'rations', name: 'Rations', axialTilt: toRadians(15) },
    { id: 'greenhouse', name: 'Greenhouse', axialTilt: toRadians(15) },
    { id: 'water-tank', name: 'Water tank', axialTilt: toRadians(12) },
    { id: 'lab', name: 'Lab', axialTilt: toRadians(10) },
    { id: 'relay-antenna', name: 'Relay antenna', axialTilt: toRadians(8) },
    { id: 'habitat-module', name: 'Habitat module', axialTilt: toRadians(15) },
  ],
  initialIndex: 0,
};
