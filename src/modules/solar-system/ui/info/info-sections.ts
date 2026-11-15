import { KM_PER_AU } from '../../core/orbit';
import { drawDistanceStrip, drawSizeComparison } from './info-drawings';
import {
  formatCarTime,
  formatDayLength,
  formatDays,
  formatDistance,
  formatLightTime,
  formatTimesEarth,
} from './info-format';
import { section } from './info-section';
import type { DrawnBody } from './info-drawings';
import type { SizedBodyId } from '../../core/body-radii';
import type { BodyFacts } from '../../core/info/body-facts';

/** A body to describe, with its facts at the described time. */
export type DescribedBody = { id: SizedBodyId; name: string; color: string; facts: BodyFacts };

const LOCALE = 'en-GB';

/** Size, compared to another body, with a to-scale drawing. */
export const sizeSection = (body: DescribedBody, comparison: DescribedBody) => {
  const width = `${Math.round(body.facts.radiusKm * 2).toLocaleString(LOCALE)} km wide.`;
  const lines =
    body.id === 'earth'
      ? [width]
      : [width, `${formatTimesEarth(body.facts.radiusInEarths)} as wide as the Earth.`];
  const drawn = (described: DescribedBody): DrawnBody => ({
    name: described.name,
    value: described.facts.radiusKm,
    color: described.color,
  });
  return section('Size', lines, drawSizeComparison(drawn(body), drawn(comparison)));
};

/** How long the body takes to turn on itself and to go around the Sun or the Earth. */
export const dayAndYearSection = ({ id, facts }: DescribedBody) => {
  const lines = [`It turns once on itself in ${formatDayLength(facts.dayHours)}.`];
  if (facts.dayHours < 0) lines.push('It spins backwards!');
  if (facts.orbit?.around === 'sun')
    lines.push(`One trip around the Sun (its year) takes ${formatDays(facts.orbit.days)}.`);
  if (facts.orbit?.around === 'earth')
    lines.push(`It goes around the Earth in ${formatDays(facts.orbit.days)}.`);
  if (id === 'moon') lines.push('That is why we always see the same face of the Moon.');
  return section('Day and year', lines);
};

/** Current distance from the Sun, with sunlight travel time and a to-scale strip. */
export const sunDistanceSection = (
  body: DescribedBody,
  earth: DescribedBody,
  distanceKm: number,
) => {
  const lines = [
    formatDistance(distanceKm),
    `Sunlight takes ${formatLightTime(distanceKm)} to get there.`,
  ];
  if (body.id === 'moon') return section('Distance from the Sun', lines);
  const onStrip = (described: DescribedBody): DrawnBody => ({
    name: described.name,
    value: (described.facts.distanceFromSunKm ?? 0) / KM_PER_AU,
    color: described.color,
  });
  const bodies = body.id === 'earth' ? [onStrip(body)] : [onStrip(earth), onStrip(body)];
  return section('Distance from the Sun', lines, drawDistanceStrip(bodies));
};

/** Current distance from the Earth, with light and car travel times. */
export const earthDistanceSection = (distanceKm: number) =>
  section('Distance from the Earth', [
    formatDistance(distanceKm),
    `Light takes ${formatLightTime(distanceKm)} to cross it.`,
    `A car at 100 km/h, driving non-stop, would need ${formatCarTime(distanceKm)}.`,
  ]);
