import { at, onDay } from './sky-event';
import { MISSION_EVENTS } from './spacecraft/mission-events';
import type { SkyEvent } from './sky-event';

const SKY_MOMENTS: readonly SkyEvent[] = [
  {
    title: 'Neptune is discovered',
    description: 'Astronomers find it exactly where maths predicted.',
    kind: 'space-history',
    ...onDay(1846, 9, 23),
    focus: 'neptune',
  },
  {
    title: 'Sputnik 1',
    description: 'The very first artificial satellite circles the Earth.',
    kind: 'space-history',
    ...at(1957, 10, 4, 19, 28),
    focus: 'sputnik-1',
  },
  {
    title: 'First human in space',
    description: 'Yuri Gagarin flies once around the Earth.',
    kind: 'space-history',
    ...at(1961, 4, 12, 6, 7),
    focus: 'vostok-1',
  },
  {
    title: 'First steps on the Moon',
    description: 'Apollo 11 lands in the Sea of Tranquility.',
    kind: 'space-history',
    ...at(1969, 7, 20, 20, 17),
    focus: 'moon',
  },
  {
    title: 'Hubble telescope launched',
    description: 'A telescope above the clouds and the air.',
    kind: 'space-history',
    ...at(1990, 4, 24, 12, 33),
    focus: 'hubble',
  },
  {
    title: 'Total solar eclipse over France',
    description: 'The Moon’s shadow crosses Europe at midday.',
    kind: 'eclipse',
    ...at(1999, 8, 11, 11, 3),
    focus: 'earth',
  },
  {
    title: 'Mars comes very close',
    description: 'Closest to the Earth in 60,000 years.',
    kind: 'planets',
    ...at(2003, 8, 27, 9, 51),
    focus: 'mars',
  },
  {
    title: 'Venus crosses the Sun',
    description: 'Venus passes right between the Sun and the Earth.',
    kind: 'planets',
    ...at(2004, 6, 8, 8, 20),
    focus: 'venus',
  },
  {
    title: 'Venus crosses the Sun again',
    description: 'The last Venus transit until 2117.',
    kind: 'planets',
    ...at(2012, 6, 6, 1, 29),
    focus: 'venus',
  },
  {
    title: 'Curiosity lands on Mars',
    description: 'A car-sized robot starts exploring Mars.',
    kind: 'space-history',
    ...at(2012, 8, 6, 5, 17),
    focus: 'mars',
  },
  {
    title: 'Mercury crosses the Sun',
    description: 'A tiny black dot slides across the Sun.',
    kind: 'planets',
    ...at(2019, 11, 11, 15, 20),
    focus: 'mercury',
  },
  {
    title: 'Jupiter and Saturn meet',
    description: 'The closest great conjunction in 400 years.',
    kind: 'planets',
    ...at(2020, 12, 21, 18, 20),
    focus: 'jupiter',
  },
  {
    title: 'James Webb telescope launched',
    description: 'The biggest space telescope ever built.',
    kind: 'space-history',
    ...at(2021, 12, 25, 12, 20),
    focus: 'jwst',
  },
  {
    title: 'Red Moon',
    description: 'Total lunar eclipse: the Moon turns red.',
    kind: 'eclipse',
    ...at(2022, 11, 8, 10, 59),
    focus: 'moon',
  },
  {
    title: 'Great American eclipse',
    description: 'Total solar eclipse over Mexico and the USA.',
    kind: 'eclipse',
    ...at(2024, 4, 8, 18, 17),
    focus: 'earth',
  },
  {
    title: 'Total solar eclipse over Spain',
    description: 'The Moon’s shadow sweeps Greenland, Iceland and Spain.',
    kind: 'eclipse',
    ...at(2026, 8, 12, 17, 46),
    focus: 'earth',
  },
  {
    title: 'Partial lunar eclipse',
    description: 'The Earth’s shadow covers most of the Moon.',
    kind: 'eclipse',
    ...at(2026, 8, 28, 4, 13),
    focus: 'moon',
  },
  {
    title: 'Eclipse of the century',
    description: 'Over 6 minutes of darkness above Egypt.',
    kind: 'eclipse',
    ...at(2027, 8, 2, 10, 7),
    focus: 'earth',
  },
  {
    title: 'New Year’s Eve red Moon',
    description: 'A total lunar eclipse to end the year 2028.',
    kind: 'eclipse',
    ...at(2028, 12, 31, 16, 52),
    focus: 'moon',
  },
  {
    title: 'Mercury crosses the Sun again',
    description: 'The next Mercury transit.',
    kind: 'planets',
    ...at(2032, 11, 13, 8, 54),
    focus: 'mercury',
  },
];

/** Eclipses, planet line-ups and space-history milestones, oldest first. */
export const SKY_EVENTS: readonly SkyEvent[] = [...SKY_MOMENTS, ...MISSION_EVENTS].sort(
  (first, second) => first.timestamp - second.timestamp,
);
