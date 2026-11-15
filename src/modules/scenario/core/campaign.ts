import { spend, START_STORES } from './base-stores';
import type { BaseStores } from './base-stores';
import type { Loadout } from './loadout';
import type { Act, Mission } from './scenario-content';

/** Where the player stands in the current mission or day. */
export type Stage =
  | 'briefing'
  | 'dashboard'
  | 'academy'
  | 'preparation'
  | 'ready'
  | 'debrief'
  | 'dayEnd'
  | 'actEnd';

export type Verdict = 'efficient' | 'wasteful' | 'unfinished';

/** How a mission went, and what it cost the base (positive) or brought it (negative). */
export type MissionResult = {
  missionId: string;
  verdict: Verdict;
  objectiveShare: number;
  used: BaseStores;
  details: Record<string, number>;
};

export type CampaignState = {
  version: 1;
  /** Date of day one (Unix ms): day N happens N − 1 days later. */
  startedAt: number;
  dayIndex: number;
  missionIndex: number;
  stage: Stage;
  /** Hours lost today when the crew had to bring the astronaut back. */
  hoursLost: number;
  stores: BaseStores;
  loadout: Loadout | null;
  lastResult: MissionResult | null;
  history: MissionResult[];
};

const DAY_MS = 86_400_000;

/** Returns a new game on day one, starting at the given date. */
export const newCampaign = (startedAt: number): CampaignState => ({
  version: 1,
  startedAt,
  dayIndex: 0,
  missionIndex: 0,
  stage: 'briefing',
  hoursLost: 0,
  stores: START_STORES,
  loadout: null,
  lastResult: null,
  history: [],
});

/** Hours the crew loses bringing an astronaut back inside. */
export const RESCUE_HOURS = 4;

/** The crew brought the astronaut back: hours are lost on the base clock. */
export const loseRescueHours = (state: CampaignState): CampaignState => ({
  ...state,
  hoursLost: (state.hoursLost ?? 0) + RESCUE_HOURS,
});

/** Returns the date of the current day (Unix ms). */
export const dayDate = (state: CampaignState, dayIndex = state.dayIndex) =>
  state.startedAt + dayIndex * DAY_MS;

/** Returns the mission being played, if the day still has one. */
export const currentMission = (act: Act, state: CampaignState): Mission | undefined =>
  act.days[state.dayIndex]?.missions[state.missionIndex];

const at = (state: CampaignState, from: Stage, change: Partial<CampaignState>) =>
  state.stage === from ? { ...state, ...change } : state;

/** The welcome is read: the station dashboard shows. */
export const readBriefing = (state: CampaignState) => at(state, 'briefing', { stage: 'dashboard' });

/** Launch mission from the dashboard opens the academy. */
export const openAcademy = (state: CampaignState) => at(state, 'dashboard', { stage: 'academy' });

/** The academy is over: pack the bag if the mission needs one, else get ready. */
export const finishAcademy = (state: CampaignState, mission: Mission) =>
  at(state, 'academy', { stage: mission.preparation ? 'preparation' : 'ready' });

/** The bag is packed: the mission can start. */
export const confirmLoadout = (state: CampaignState, loadout: Loadout) =>
  at(state, 'preparation', { stage: 'ready', loadout });

/** The mission is over: its cost is taken from the base and the mascot debriefs it. */
export const recordResult = (state: CampaignState, result: MissionResult) =>
  at(state, 'ready', {
    stage: 'debrief',
    stores: spend(state.stores, result.used),
    lastResult: result,
    history: [...state.history, result],
  });

/** Try the mission again; what was used stays used. */
export const retryMission = (state: CampaignState, mission: Mission) =>
  at(state, 'debrief', { stage: mission.preparation ? 'preparation' : 'ready' });

/** Go on to the next mission of the day, or end the day. */
export const continueAfterDebrief = (state: CampaignState, act: Act) => {
  const next = state.missionIndex + 1;
  const more = next < (act.days[state.dayIndex]?.missions.length ?? 0);
  return at(state, 'debrief', {
    stage: more ? 'briefing' : 'dayEnd',
    missionIndex: more ? next : state.missionIndex,
    loadout: null,
  });
};

/** Start the next day, or end the act when no day with missions is left. */
export const startNextDay = (state: CampaignState, act: Act) => {
  const next = state.dayIndex + 1;
  const playable = (act.days[next]?.missions.length ?? 0) > 0;
  return at(state, 'dayEnd', {
    stage: playable ? 'briefing' : 'actEnd',
    hoursLost: 0,
    dayIndex: next,
    missionIndex: 0,
  });
};
