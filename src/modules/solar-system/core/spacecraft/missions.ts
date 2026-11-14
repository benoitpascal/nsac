import { MISSION_TEXTS } from './mission-texts';
import type { MissionText } from './mission-texts';
import type { MissionId } from './spacecraft-ids';

/** Body a mission's positions are measured from. */
export type MissionFrame = 'earth' | 'sun';

/** A spacecraft flight, shown only between its start and end (Unix ms). */
export type Mission = MissionText & {
  id: MissionId;
  frame: MissionFrame;
  window: { start: number; end: number };
};

/** Missions still flying are shown up to this date: later positions are only forecasts. */
const FORECAST_LIMIT = '2030-01-01T00:00Z';

const mission = (id: MissionId, frame: MissionFrame, start: string, end: string): Mission => ({
  id,
  ...MISSION_TEXTS[id],
  frame,
  window: { start: Date.parse(start), end: Date.parse(end) },
});

/** Famous flights, with their launch and end dates (UTC). */
export const MISSIONS: readonly Mission[] = [
  mission('sputnik-1', 'earth', '1957-10-04T19:28Z', '1958-01-04T00:00Z'),
  mission('vostok-1', 'earth', '1961-04-12T06:07Z', '1961-04-12T07:55Z'),
  mission('apollo-11', 'earth', '1969-07-16T13:32Z', '1969-07-24T16:50Z'),
  mission('curiosity', 'sun', '2011-11-26T15:02Z', '2012-08-06T05:17Z'),
  mission('jwst', 'earth', '2021-12-25T12:20Z', FORECAST_LIMIT),
  mission('voyager-1', 'sun', '1977-09-05T12:56Z', FORECAST_LIMIT),
  mission('voyager-2', 'sun', '1977-08-20T14:29Z', FORECAST_LIMIT),
  mission('cassini', 'sun', '1997-10-15T08:43Z', '2017-09-15T10:31Z'),
  mission('new-horizons', 'sun', '2006-01-19T19:00Z', FORECAST_LIMIT),
];
