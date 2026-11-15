import { spend, START_STORES } from './base-stores';
import { NIGHT_COST, PRINTER, printBricks } from './printer';
import { KNOWLEDGE_BY_QUALITY } from './quality';
import type { BaseStores } from './base-stores';
import type { Loadout } from './loadout';
import type { Cargo } from './printer';
import type { Quality } from './quality';
import type { Act, Mission } from './scenario-content';

/** Where the player stands in the current day. */
export type Stage =
  | 'briefing'
  | 'planning'
  | 'academy'
  | 'preparation'
  | 'ready'
  | 'debrief'
  | 'dayClosing'
  | 'dayEnd'
  | 'actEnd';

export type Verdict = 'efficient' | 'wasteful' | 'unfinished';

/** How a mission went, what it cost the base (positive) or brought it (negative), and what it made. */
export type MissionResult = {
  missionId: string;
  verdict: Verdict;
  objectiveShare: number;
  used: Partial<BaseStores>;
  details: Record<string, number>;
  /** Regolith the robot brought back (kg). */
  regolithKg?: number;
  /** Bricks gained (positive) or wasted (negative). */
  bricks?: number;
  /** Knowledge the mission brought. */
  knowledge?: number;
  printerQuality?: Quality;
  shelterQuality?: Quality;
};

export type CampaignState = {
  version: 3;
  /** Date of day one (Unix ms): day N happens N − 1 days later. */
  startedAt: number;
  dayIndex: number;
  /** Mission being played, once picked. */
  missionId: string | null;
  /** Missions of the day already played, in the order they were played. */
  doneMissionIds: string[];
  stage: Stage;
  /** Hours lost today when the crew had to bring the astronaut back. */
  hoursLost: number;
  stores: BaseStores;
  cargo: Cargo;
  /** What the crew has learnt so far (points). */
  knowledge: number;
  printerQuality: Quality | null;
  shelterQuality: Quality | null;
  loadout: Loadout | null;
  lastResult: MissionResult | null;
  history: MissionResult[];
};

const DAY_MS = 86_400_000;
/** Bricks the base has when the crew lands (validated scenario, see DATA.md). */
const START_BRICKS = 4;

/** Hours the crew loses bringing an astronaut back inside. */
export const RESCUE_HOURS = 4;

/** Returns a new game on day one, starting at the given date. */
export const newCampaign = (startedAt: number): CampaignState => ({
  version: 3,
  startedAt,
  dayIndex: 0,
  missionId: null,
  doneMissionIds: [],
  stage: 'briefing',
  hoursLost: 0,
  stores: START_STORES,
  cargo: { regolithKg: 0, bricks: START_BRICKS },
  knowledge: 0,
  printerQuality: null,
  shelterQuality: null,
  loadout: null,
  lastResult: null,
  history: [],
});

/** Returns the date of the current day (Unix ms). */
export const dayDate = (state: CampaignState, dayIndex = state.dayIndex) =>
  state.startedAt + dayIndex * DAY_MS;

/** Returns the mission being played, if one is picked. */
export const currentMission = (act: Act, state: CampaignState): Mission | undefined =>
  act.days[state.dayIndex]?.missions.find((mission) => mission.id === state.missionId);

/** Returns the missions of the day not played yet. */
export const missionsLeft = (act: Act, state: CampaignState): Mission[] =>
  (act.days[state.dayIndex]?.missions ?? []).filter(
    (mission) => !state.doneMissionIds.includes(mission.id),
  );

const at = (state: CampaignState, from: Stage, change: Partial<CampaignState>) =>
  state.stage === from ? { ...state, ...change } : state;

/** The crew brought the astronaut back: hours are lost on the base clock. */
export const loseRescueHours = (state: CampaignState): CampaignState => ({
  ...state,
  hoursLost: state.hoursLost + RESCUE_HOURS,
});

/** The mission picked in the mascot's opening starts with its academy. */
export const chooseMission = (state: CampaignState, act: Act, missionId: string) =>
  missionsLeft(act, state).some((mission) => mission.id === missionId)
    ? at(state, 'briefing', { stage: 'academy', missionId })
    : state;

/** The mascot's opening of a planned day is over: the commander plans the base's work. */
export const startPlanning = (state: CampaignState, act: Act) =>
  act.days[state.dayIndex]?.planning ? at(state, 'briefing', { stage: 'planning' }) : state;

/** The academy is over: pack the bag if the mission needs one, else get ready. */
export const finishAcademy = (state: CampaignState, mission: Mission) =>
  at(state, 'academy', { stage: mission.preparation ? 'preparation' : 'ready' });

/** The bag is packed: the mission can start. */
export const confirmLoadout = (state: CampaignState, loadout: Loadout) =>
  at(state, 'preparation', { stage: 'ready', loadout });

/** The mission is over: its cost is taken from the base, what it made is kept, the mascot debriefs it. */
export const recordResult = (state: CampaignState, result: MissionResult) =>
  at(state, 'ready', {
    stage: 'debrief',
    stores: spend(state.stores, result.used),
    cargo: {
      regolithKg: state.cargo.regolithKg + (result.regolithKg ?? 0),
      bricks: Math.max(0, state.cargo.bricks + (result.bricks ?? 0)),
    },
    knowledge: state.knowledge + (result.knowledge ?? 0),
    printerQuality: result.printerQuality ?? state.printerQuality,
    shelterQuality: result.shelterQuality ?? state.shelterQuality,
    lastResult: result,
    history: [...state.history, result],
  });

/** Try the mission again; what was used stays used. */
export const retryMission = (state: CampaignState, mission: Mission) =>
  at(state, 'debrief', { stage: mission.preparation ? 'preparation' : 'ready' });

/**
 * Go on to the mission left today, without asking again, or to the end of the day. On a planned
 * day the commander's single action picked the mission, so the day ends after it.
 */
export const continueAfterDebrief = (state: CampaignState, act: Act) => {
  const done = [...state.doneMissionIds, ...(state.missionId ? [state.missionId] : [])];
  const planned = act.days[state.dayIndex]?.planning === true;
  const next = planned ? undefined : missionsLeft(act, { ...state, doneMissionIds: done })[0];
  return at(state, 'debrief', {
    stage: next ? 'academy' : 'dayClosing',
    missionId: next?.id ?? null,
    doneMissionIds: done,
    loadout: null,
  });
};

/**
 * Ends the day: the printer turns the regolith into bricks for some power when asked, then the
 * night costs the base its share of air, power and water.
 */
export const closeDay = (state: CampaignState, print: boolean) => {
  const printing = print ? PRINTER.powerPoints : 0;
  const quality = state.printerQuality ?? 'failed';
  return at(state, 'dayClosing', {
    stage: 'dayEnd',
    cargo: print ? printBricks(state.cargo, quality) : state.cargo,
    knowledge: state.knowledge + (print ? KNOWLEDGE_BY_QUALITY[quality] : 0),
    stores: spend(state.stores, { ...NIGHT_COST, power: NIGHT_COST.power + printing }),
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
    missionId: null,
    doneMissionIds: [],
  });
};
