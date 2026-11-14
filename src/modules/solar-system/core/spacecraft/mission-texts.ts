import type { MissionId } from './spacecraft-ids';

/** How a mission is named and described on its facts sheet. */
export type MissionText = { name: string; summary: string; destination: string };

/** Names and descriptions of the missions. */
export const MISSION_TEXTS: Record<MissionId, MissionText> = {
  'sputnik-1': {
    name: 'Sputnik 1',
    summary: 'The very first satellite. It beeped its radio signal for 21 days.',
    destination: 'Around the Earth',
  },
  'vostok-1': {
    name: 'Vostok 1',
    summary: 'Yuri Gagarin, the first human in space, flies once around the Earth.',
    destination: 'Around the Earth',
  },
  'apollo-11': {
    name: 'Apollo 11',
    summary: 'Takes the first people to walk on the Moon, and brings them back.',
    destination: 'The Moon',
  },
  curiosity: {
    name: 'Curiosity',
    summary: 'Carries the Curiosity rover, a car-sized robot, to Mars.',
    destination: 'Mars',
  },
  jwst: {
    name: 'James Webb',
    summary: 'The biggest telescope in space, looking at the first stars and galaxies.',
    destination: 'A quiet spot 1.5 million km from the Earth',
  },
  'voyager-1': {
    name: 'Voyager 1',
    summary: 'Flew past Jupiter and Saturn. It is the farthest spacecraft from the Earth.',
    destination: 'Jupiter, Saturn, then the stars',
  },
  'voyager-2': {
    name: 'Voyager 2',
    summary: 'The only spacecraft that ever visited Uranus and Neptune.',
    destination: 'Jupiter, Saturn, Uranus, Neptune',
  },
  cassini: {
    name: 'Cassini',
    summary: 'Went around Saturn for 13 years, then dived into it.',
    destination: 'Saturn',
  },
  'new-horizons': {
    name: 'New Horizons',
    summary: 'The first spacecraft to fly past Pluto, in 2015.',
    destination: 'Pluto, then farther',
  },
};
