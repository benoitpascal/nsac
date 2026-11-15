/** What the base says on the radio the first time the astronaut walks out each day. */
export const EARTH_RADIO_LINES = [
  'Base to commander, do you copy?',
  "I know it might feel like a game. But it's not completely one.",
  'Look up: the Earth is high in the sky. From our base, it stays right there, day and night.',
] as const;

/** The radio message as it is read aloud. */
export const EARTH_RADIO_SPEECH = EARTH_RADIO_LINES.join(' ');

/** Returns every message the radio reads aloud, for the voice generation script. */
export const earthRadioVoiceLines = () => [EARTH_RADIO_SPEECH];
