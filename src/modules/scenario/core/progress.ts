import type { CampaignState } from './campaign';
import type { Act } from './scenario-content';

/** « Day 01 »: the day label of the HUD headers (Figma « JOUR 01 »). */
export const dayLabel = (dayIndex: number) => `Day ${String(dayIndex + 1).padStart(2, '0')}`;

/**
 * Main mission progress (0 to 1): the share of the act's missions already played. Every mission
 * counts the same; the act is complete once it has ended.
 */
export const actProgress = (act: Act, state: CampaignState) => {
  if (state.stage === 'actEnd') return 1;
  const total = act.days.reduce((sum, day) => sum + day.missions.length, 0);
  if (total === 0) return 0;
  const before = act.days
    .slice(0, state.dayIndex)
    .reduce((sum, day) => sum + day.missions.length, 0);
  const today = (act.days[state.dayIndex]?.missions ?? []).filter((mission) =>
    state.doneMissionIds.includes(mission.id),
  ).length;
  return Math.min(1, (before + today) / total);
};
