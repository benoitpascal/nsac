import { satelliteOrbit } from './satellite-orbits';
import type { EarthOrbitElements } from './orbits/earth-orbit-elements';
import type { SatelliteId } from './spacecraft-ids';

/** A satellite around the Earth, shown from its launch onwards. */
export type Satellite = {
  id: SatelliteId;
  name: string;
  role: string;
  launch: number;
  orbit: EarthOrbitElements;
};

const satellite = (id: SatelliteId, name: string, role: string, launch: string): Satellite => ({
  id,
  name,
  role,
  launch: Date.parse(launch),
  orbit: satelliteOrbit(id),
});

/** Famous satellites still flying, with their launch dates (UTC). */
export const SATELLITES: readonly Satellite[] = [
  satellite('iss', 'ISS', 'Astronauts live and work here.', '1998-11-20T06:40Z'),
  satellite('hubble', 'Hubble', 'A telescope above the air.', '1990-04-24T12:33Z'),
  satellite('tiangong', 'Tiangong', "China's space station.", '2021-04-29T03:23Z'),
  satellite('gps', 'GPS III-1', 'Tells your phone where you are.', '2018-12-23T13:51Z'),
  satellite('galileo', 'Galileo', "Europe's satellite navigation.", '2011-10-21T10:30Z'),
  satellite('noaa-20', 'NOAA-20', 'Watches the weather from pole to pole.', '2017-11-18T09:47Z'),
  satellite('landsat-9', 'Landsat 9', 'Takes pictures of the land.', '2021-09-27T18:12Z'),
  satellite(
    'sentinel-2a',
    'Sentinel-2A',
    'Watches forests, fields and coasts.',
    '2015-06-23T01:51Z',
  ),
  satellite('terra', 'Terra', 'Studies the air, the land and the oceans.', '1999-12-18T18:57Z'),
  satellite('starlink', 'Starlink', 'Brings the internet from space.', '2019-11-11T14:56Z'),
];
