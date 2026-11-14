import { MAX_SCORE } from '../../../core/minigame';
import { LIVES, SHOT_PAUSE, SPEED_GROWTH, WINS_NEEDED, ZONE_SHRINK, placeZone } from './docking';
import type { Docking, Random } from './docking';

/** Share of a success's points always earned; the rest rewards stopping near the centre. */
const BASE_SHARE = 0.5;
/** Points one success can bring at most. */
const POINTS_PER_SUCCESS = MAX_SCORE / WINS_NEEDED;

/** Tells whether the run is over and how: still playing, won or lost. */
export const outcomeOf = (docking: Docking): 'playing' | 'won' | 'lost' => {
  if (docking.successes >= WINS_NEEDED) return 'won';
  if (docking.misses >= LIVES) return 'lost';
  return 'playing';
};

/** Score of the run from 0 to MAX_SCORE, from successes and how close to the centre they were. */
export const scoreOf = (docking: Docking) => Math.min(MAX_SCORE, Math.round(docking.points));

const accuracyOf = (docking: Docking) => {
  const distance = Math.abs(docking.cursor - docking.zoneCenter);
  return Math.max(0, 1 - distance / (docking.zoneWidth / 2));
};

const succeed = (docking: Docking, random: Random): Docking => {
  const zoneWidth = docking.zoneWidth * ZONE_SHRINK;
  const gained = POINTS_PER_SUCCESS * (BASE_SHARE + (1 - BASE_SHARE) * accuracyOf(docking));
  return {
    ...docking,
    successes: docking.successes + 1,
    points: docking.points + gained,
    speed: docking.speed * SPEED_GROWTH,
    zoneWidth,
    zoneCenter: placeZone(zoneWidth, random),
  };
};

/**
 * Stops the cursor where it is: inside the zone, the success makes the next zone smaller,
 * placed elsewhere, and the cursor faster; outside, a life is lost. The bar then freezes for a
 * moment. Ignored while the bar is frozen or once the run is over.
 */
export const stopCursor = (docking: Docking, random: Random): Docking => {
  if (docking.pause > 0 || outcomeOf(docking) !== 'playing') return docking;
  const hit = Math.abs(docking.cursor - docking.zoneCenter) <= docking.zoneWidth / 2;
  const shot = { position: docking.cursor, hit };
  const next = hit ? succeed(docking, random) : { ...docking, misses: docking.misses + 1 };
  return { ...next, shot, pause: SHOT_PAUSE };
};
