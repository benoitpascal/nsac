import { KNOWLEDGE_BY_QUALITY, qualityOf } from './quality';
import type { MissionResult } from './campaign';

/**
 * Irrigation of the greenhouse (pipe flow mini-game), by build quality: food the seeds will give
 * (points), and water lost through leaks (points). Invented for balancing, see DATA.md.
 */
export const GREENHOUSE = {
  food: { optimal: 20, partial: 20, failed: 10 },
  leakedWater: { optimal: 0, partial: 8, failed: 15 },
} as const;

/**
 * Works out the greenhouse irrigation: every extra turn of a pipe lets water leak, so a rough job
 * costs water and, when very rough, waters fewer seeds; the knowledge follows the quality.
 */
export const scoreGreenhouse = (won: boolean, score: number): MissionResult => {
  const quality = qualityOf(won ? score : 0);
  const food = won ? GREENHOUSE.food[quality] : 0;
  const water = GREENHOUSE.leakedWater[quality];
  return {
    missionId: 'greenhouse',
    verdict: !won ? 'unfinished' : quality === 'optimal' ? 'efficient' : 'wasteful',
    objectiveShare: won ? 1 : 0,
    used: { water, food: 0 - food },
    details: { score, won: won ? 1 : 0 },
    knowledge: KNOWLEDGE_BY_QUALITY[quality],
  };
};
