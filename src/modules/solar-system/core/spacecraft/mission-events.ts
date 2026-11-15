import { at, onDay } from '../sky-event';
import type { MissionId } from './spacecraft-ids';
import type { SkyEvent } from '../sky-event';

type Moment = Pick<SkyEvent, 'timestamp' | 'precision'>;

const flight = (
  title: string,
  description: string,
  moment: Moment,
  focus: MissionId,
): SkyEvent => ({
  title,
  description,
  kind: 'space-history',
  ...moment,
  focus,
});

/** Launches and visits of the missions whose flight is shown (UTC, from NASA mission pages). */
// prettier-ignore
export const MISSION_EVENTS: readonly SkyEvent[] = [
  flight('Apollo 11 lifts off', 'Three astronauts leave for the Moon.', at(1969, 7, 16, 13, 32), 'apollo-11'),
  flight('Voyager 2 lifts off', 'Off to visit the four giant planets.', at(1977, 8, 20, 14, 29), 'voyager-2'),
  flight('Voyager 1 lifts off', 'Off to Jupiter, Saturn and beyond.', at(1977, 9, 5, 12, 56), 'voyager-1'),
  flight('Voyager 1 flies past Jupiter', 'The first close-up of its storms.', at(1979, 3, 5, 12, 5), 'voyager-1'),
  flight('Voyager 1 flies past Saturn', 'A close look at its rings.', at(1980, 11, 12, 23, 46), 'voyager-1'),
  flight('Voyager 2 flies past Uranus', 'The only visit Uranus ever had.', at(1986, 1, 24, 17, 59), 'voyager-2'),
  flight('Voyager 2 flies past Neptune', 'The last planet gets its first visitor.', at(1989, 8, 25, 3, 56), 'voyager-2'),
  flight('Cassini lifts off', 'A seven-year trip to Saturn begins.', at(1997, 10, 15, 8, 43), 'cassini'),
  flight('Cassini arrives at Saturn', 'It starts going around the planet.', at(2004, 7, 1, 2, 48), 'cassini'),
  flight('Curiosity lifts off', 'The rover leaves for Mars.', at(2011, 11, 26, 15, 2), 'curiosity'),
  flight('Voyager 1 leaves the Sun’s bubble', 'The first craft to reach the space between the stars.', onDay(2012, 8, 25), 'voyager-1'),
  flight('New Horizons flies past Pluto', 'The first pictures of Pluto up close.', at(2015, 7, 14, 11, 49), 'new-horizons'),
  flight('Cassini dives into Saturn', 'Its last mission: falling into Saturn.', at(2017, 9, 15, 10, 31), 'cassini'),
];
