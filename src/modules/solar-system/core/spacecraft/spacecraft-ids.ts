import type { SizedBodyId } from '../body-radii';

export type SatelliteId =
  | 'iss'
  | 'hubble'
  | 'tiangong'
  | 'gps'
  | 'galileo'
  | 'noaa-20'
  | 'landsat-9'
  | 'sentinel-2a'
  | 'terra'
  | 'starlink';

export type MissionId =
  | 'sputnik-1'
  | 'vostok-1'
  | 'apollo-11'
  | 'curiosity'
  | 'jwst'
  | 'voyager-1'
  | 'voyager-2'
  | 'cassini'
  | 'new-horizons';

export type SpacecraftId = SatelliteId | MissionId;

/** Anything the camera can fly to: a body or a spacecraft. */
export type FocusId = SizedBodyId | SpacecraftId;
