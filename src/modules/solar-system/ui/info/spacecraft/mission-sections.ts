import { formatDays, formatDistance, formatLightTime } from '../info-format';
import { section } from '../info-section';
import { formatAltitude, formatLaunchDate, formatSpeed } from './spacecraft-format';
import type { MissionFacts } from '../../../core/info/mission-facts';

const HOURS_PER_DAY = 24;

const flownFor = (days: number) => {
  const hours = Math.round(days * HOURS_PER_DAY);
  if (hours < 1) return 'less than an hour';
  if (hours === 1) return 'an hour';
  return hours < HOURS_PER_DAY ? `${hours} hours` : formatDays(days);
};

const whereSection = (facts: MissionFacts) => {
  const lines =
    facts.altitudeKm !== undefined
      ? [`${formatAltitude(facts.altitudeKm)} above the ground.`]
      : [
          `${formatDistance(facts.distanceFromEarthKm)} from the Earth.`,
          `Its radio signal takes ${formatLightTime(facts.distanceFromEarthKm)} to reach us.`,
        ];
  if (facts.distanceFromSunKm !== undefined)
    lines.push(`${formatDistance(facts.distanceFromSunKm)} from the Sun.`);
  if (facts.speedKmPerS > 0) lines.push(`It flies at ${formatSpeed(facts.speedKmPerS)}.`);
  return section('Where it is now', lines);
};

/** Builds the facts sections of a mission: what it does and where it is at the shown time. */
export const missionSections = (facts: MissionFacts | undefined): HTMLElement[] =>
  facts
    ? [
        section('The mission', [
          facts.summary,
          `Destination: ${facts.destination}.`,
          `Launched on ${formatLaunchDate(facts.launch)}, ${flownFor(facts.daysFlown)} ago.`,
        ]),
        whereSection(facts),
      ]
    : [];
