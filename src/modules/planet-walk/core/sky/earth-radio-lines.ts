import { moonAndEarthPhases } from './phases';

/** Steps through the Moon's cycle finely enough to meet every phase. */
const CYCLE_SAMPLES = 100;

/**
 * Returns what the base says on the radio at that point of the Moon's cycle (0 new Moon, 0.5 full
 * Moon): the Earth's phase seen from the Moon, and the Moon's seen from home.
 */
export const earthRadioLines = (lunationShare: number) => {
  const { earth, moon } = moonAndEarthPhases(lunationShare);
  return [
    'Base to commander, do you copy?',
    "I know it might feel like a game. But it's not completely one.",
    `Look up at the Earth: today it is a ${earth} Earth.`,
    `Back home, people see a ${moon} Moon: the Earth and the Moon always show opposite phases.`,
  ];
};

/** Returns the radio message as it is read aloud. */
export const earthRadioSpeech = (lunationShare: number) =>
  earthRadioLines(lunationShare).join(' ');

/** Returns every message the radio can read aloud, once, for the voice generation script. */
export const earthRadioVoiceLines = () => [
  ...new Set(
    Array.from({ length: CYCLE_SAMPLES }, (_, step) => earthRadioSpeech((step + 0.5) / CYCLE_SAMPLES)),
  ),
];
