/** What the game is about, shown under the day's objectives in the terminal menu. */
export const GAME_GOAL =
  'Keep your crew safe and your base running. Nothing is free in space: saving power today can leave you short of oxygen tomorrow. Think ahead, and if something goes wrong, find out why and try again.';

/** The steps of a day at the base, for « How to play ». */
export const HOW_TO_PLAY = [
  'Walk to the terminal in the base hall and press E to use it.',
  'Choose « Continue mission »: the robot assistant tells you what the base needs today.',
  'Pack your bag, then play the mission: drive the robot, print bricks, build the shelter.',
  'Read the debrief: it shows how much air, power and water your choices used.',
  'Watch the base resources: oxygen to breathe, power from the Sun, water and food.',
] as const;

/** Who made the game and where its data come from. */
export const CREDITS =
  'Made by the Project Arcadia team for the NASA Space Apps Challenge 2026, challenge « Build a Junior Astronaut Mission Trainer ». Data: NASA Open APIs, NASA/JPL Horizons, CelesTrak.';

/** The keys of the 3D base, for « Controls ». */
export const CONTROLS: readonly (readonly [keys: string, use: string])[] = [
  ['Z S or W S', 'Walk forward and back'],
  ['Q D or A D, arrows', 'Turn'],
  ['Shift', 'Run'],
  ['Space', 'Jump, or dig with the robot'],
  ['E', 'Open a door, use the terminal, leave the robot'],
  ['V', 'Change the view'],
  ['H', 'Show or hide the help'],
];
