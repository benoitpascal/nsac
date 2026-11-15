import { assembledBody } from './assembled.body';
import { assembleCommunicationSatellite } from './parts/communication.parts';
import { assembleCubeSat } from './parts/cubesat.parts';
import { assembleNavigationSatellite } from './parts/navigation.parts';
import { assembleSpaceProbe } from './parts/probe.parts';
import { assembleRadarSatellite } from './parts/radar.parts';
import { assembleSpaceStation } from './parts/station.parts';
import { assembleSpaceTelescope } from './parts/telescope.parts';
import { assembleWeatherSatellite } from './parts/weather.parts';
import type { CelestialBodyId } from '../../../core/bodies';
import type { BodyFactory } from '../body';

/** Factories of the spacecraft models, scaled to fit the view. */
export const SATELLITE_FACTORIES = {
  'communication-satellite': assembledBody(assembleCommunicationSatellite, 0.95),
  'navigation-satellite': assembledBody(assembleNavigationSatellite, 0.95),
  'weather-satellite': assembledBody(assembleWeatherSatellite, 1),
  'radar-satellite': assembledBody(assembleRadarSatellite, 0.95),
  'space-telescope': assembledBody(assembleSpaceTelescope, 1.25),
  'space-station': assembledBody(assembleSpaceStation, 0.8),
  cubesat: assembledBody(assembleCubeSat, 1.2),
  'space-probe': assembledBody(assembleSpaceProbe, 0.7),
} satisfies Partial<Record<CelestialBodyId, BodyFactory>>;
