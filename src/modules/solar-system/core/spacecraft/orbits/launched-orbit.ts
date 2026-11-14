import { EARTH_RADIUS_KM } from '../../moon-orbit';
import { greenwichSiderealAngle } from './sidereal-time';
import type { EarthOrbitElements } from './earth-orbit-elements';

/** A launch site on the Earth, in degrees. */
export type LaunchSite = { latitude: number; longitude: number };

/** Published shape of an orbit right after launch. */
export type LaunchedOrbitShape = { perigeeKm: number; apogeeKm: number; inclination: number };

/** Baikonur cosmodrome, Kazakhstan. */
export const BAIKONUR: LaunchSite = { latitude: 45.92, longitude: 63.34 };

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Builds an orbit with the published shape whose perigee lies above the launch site at launch
 * time, heading north-east: the orbital plane is turned so that the craft starts over the site.
 */
export const orbitFromLaunch = (
  shape: LaunchedOrbitShape,
  site: LaunchSite,
  launch: number,
): EarthOrbitElements => {
  const perigee = EARTH_RADIUS_KM + shape.perigeeKm;
  const apogee = EARTH_RADIUS_KM + shape.apogeeKm;
  const inclination = toRadians(shape.inclination);
  const latitude = toRadians(site.latitude);
  const argumentOfLatitude = Math.asin(Math.sin(latitude) / Math.sin(inclination));
  const rightAscension = greenwichSiderealAngle(launch) + toRadians(site.longitude);
  const fromNode = Math.atan2(
    Math.cos(inclination) * Math.sin(argumentOfLatitude),
    Math.cos(argumentOfLatitude),
  );
  return {
    epoch: launch,
    semiMajorAxisKm: (perigee + apogee) / 2,
    eccentricity: (apogee - perigee) / (apogee + perigee),
    inclinationDegrees: shape.inclination,
    ascendingNodeDegrees: toDegrees(rightAscension - fromNode),
    periapsisArgumentDegrees: toDegrees(argumentOfLatitude),
    meanAnomalyDegrees: 0,
  };
};
