import type { CampaignState } from './campaign';
import type { Act, Day } from './scenario-content';

/** « Day 01 »: the day label of the HUD headers (Figma « JOUR 01 »). */
export const dayLabel = (dayIndex: number) => `Day ${String(dayIndex + 1).padStart(2, '0')}`;

/** Missions a day counts: on a planned day the commander picks one of them. */
const playedPerDay = (day: Day) =>
  day.planning ? Math.min(1, day.missions.length) : day.missions.length;

/**
 * Main mission progress (0 to 1): the share of the act's missions already played. Every mission
 * counts the same; the act is complete once it has ended.
 */
export const actProgress = (act: Act, state: CampaignState) => {
  if (state.stage === 'actEnd') return 1;
  const total = act.days.reduce((sum, day) => sum + playedPerDay(day), 0);
  if (total === 0) return 0;
  const before = act.days.slice(0, state.dayIndex).reduce((sum, day) => sum + playedPerDay(day), 0);
  const today = (act.days[state.dayIndex]?.missions ?? []).filter((mission) =>
    state.doneMissionIds.includes(mission.id),
  ).length;
  return Math.min(1, (before + today) / total);
};

export type Objective = { id: string; text: string; done: boolean; current: boolean };

/**
 * Today's objectives: the day's missions, ticked once played, the picked one marked current. On a
 * planned day, once the commander has picked a mission, only that one is shown.
 */
export const dayObjectives = (act: Act, state: CampaignState): Objective[] => {
  const day = act.days[state.dayIndex];
  const picked = (id: string) => id === state.missionId || state.doneMissionIds.includes(id);
  const missions = (day?.missions ?? []).filter(
    (mission) => !day?.planning || !day.missions.some(({ id }) => picked(id)) || picked(mission.id),
  );
  return missions.map((mission) => ({
    id: mission.id,
    text: mission.goal,
    done: state.doneMissionIds.includes(mission.id),
    current: mission.id === state.missionId,
  }));
};
