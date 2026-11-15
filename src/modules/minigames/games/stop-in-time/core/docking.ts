/** Returns a number in [0, 1), like Math.random. */
export type Random = () => number;

/** Where the last stop landed on the bar (0 to 1) and whether it was inside the zone. */
export type Shot = { position: number; hit: boolean };

/**
 * A docking run: the cursor position on the bar (0 left, 1 right), its direction and speed
 * (bar lengths per second), the green zone (centre and width, in bar lengths), the count of
 * successes and misses, the points earned, the last shot and how long (s) the bar stays frozen.
 */
export type Docking = {
  cursor: number;
  direction: 1 | -1;
  speed: number;
  zoneCenter: number;
  zoneWidth: number;
  successes: number;
  misses: number;
  points: number;
  shot: Shot | undefined;
  pause: number;
};

/** Successes needed to win. */
export const WINS_NEEDED = 5;
/** Misses allowed before losing. */
export const LIVES = 3;
/** Width of the first zone, in bar lengths. */
export const START_ZONE_WIDTH = 0.24;
/** Speed of the cursor at the start, in bar lengths per second. */
export const START_SPEED = 0.6;
/** Each success multiplies the zone width by this factor. */
export const ZONE_SHRINK = 0.78;
/** Each success multiplies the cursor speed by this factor. */
export const SPEED_GROWTH = 1.22;
/** Seconds the bar stays frozen after a stop, to show the result. */
export const SHOT_PAUSE = 0.8;

/** Places a zone of the given width fully on the bar, at a random spot. */
export const placeZone = (width: number, random: Random) => width / 2 + random() * (1 - width);

/** Starts a run: a slow cursor on the left and a wide zone somewhere on the bar. */
export const startDocking = (random: Random): Docking => ({
  cursor: 0,
  direction: 1,
  speed: START_SPEED,
  zoneCenter: placeZone(START_ZONE_WIDTH, random),
  zoneWidth: START_ZONE_WIDTH,
  successes: 0,
  misses: 0,
  points: 0,
  shot: undefined,
  pause: 0,
});

const bounce = (position: number, direction: 1 | -1) => {
  if (position > 1) return { cursor: 2 - position, direction: -1 as const };
  if (position < 0) return { cursor: -position, direction: 1 as const };
  return { cursor: position, direction };
};

/**
 * Returns the run after the given time: the cursor sweeps the bar back and forth, or, while the
 * bar is frozen after a stop, the freeze runs down.
 */
export const moveCursor = (docking: Docking, seconds: number): Docking => {
  if (docking.pause > 0) return { ...docking, pause: Math.max(0, docking.pause - seconds) };
  const travel = (docking.speed * seconds) % 2;
  return { ...docking, ...bounce(docking.cursor + docking.direction * travel, docking.direction) };
};
