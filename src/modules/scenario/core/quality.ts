/** How well a mini-game job was done: the printer calibration, the shelter build. */
export type Quality = 'optimal' | 'partial' | 'failed';

/** Returns the quality of a mini-game score (0 to 100), as in the validated scenario. */
export const qualityOf = (score: number): Quality =>
  score >= 70 ? 'optimal' : score >= 40 ? 'partial' : 'failed';

/** Knowledge a job brings, by how well it was done. */
export const KNOWLEDGE_BY_QUALITY: Record<Quality, number> = { optimal: 10, partial: 6, failed: 3 };
