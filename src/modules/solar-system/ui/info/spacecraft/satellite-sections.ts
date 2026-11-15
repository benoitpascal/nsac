import { formatDayLength } from '../info-format';
import { section } from '../info-section';
import {
  formatAltitude,
  formatLaunchDate,
  formatSpeed,
  formatTurnsPerDay,
} from './spacecraft-format';
import type { SatelliteFacts } from '../../../core/info/satellite-facts';

/** Builds the facts sections of a satellite: what it does and how it goes around the Earth. */
export const satelliteSections = (facts: SatelliteFacts): HTMLElement[] => [
  section('What it does', [facts.role, `Launched on ${formatLaunchDate(facts.launch)}.`]),
  section('Its orbit', [
    `${formatAltitude(facts.altitudeKm)} above the ground.`,
    `It flies at ${formatSpeed(facts.speedKmPerS)}.`,
    `It goes around the Earth in ${formatDayLength(facts.periodHours)}, ${formatTurnsPerDay(facts.periodHours)}.`,
  ]),
];
