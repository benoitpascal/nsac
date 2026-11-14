export type WalkWorldId = 'moon' | 'mercury' | 'mars' | 'venus' | 'earth';

/** A world with a solid ground to walk on, and its surface gravity in m/s². */
export type WalkWorld = { id: WalkWorldId; name: string; gravity: number };

/** Surface gravity of the Earth, in m/s². */
export const EARTH_GRAVITY = 9.81;

/** Worlds to walk on, from the weakest gravity to the strongest (NASA fact sheets). */
export const WALK_WORLDS: readonly WalkWorld[] = [
  { id: 'moon', name: 'Moon', gravity: 1.62 },
  { id: 'mercury', name: 'Mercury', gravity: 3.7 },
  { id: 'mars', name: 'Mars', gravity: 3.71 },
  { id: 'venus', name: 'Venus', gravity: 8.87 },
  { id: 'earth', name: 'Earth', gravity: EARTH_GRAVITY },
];

/** World the walk starts on. */
export const FIRST_WORLD_ID: WalkWorldId = 'moon';
