import type { CampaignState, Stage } from '../core/campaign';

const KEY = 'arcadia.campaign';
const STAGES: readonly Stage[] = [
  'briefing',
  'planning',
  'academy',
  'preparation',
  'ready',
  'debrief',
  'dayClosing',
  'dayEnd',
  'actEnd',
];

const isPercent = (value: unknown) => typeof value === 'number' && value >= 0 && value <= 100;

const isCampaign = (value: unknown): value is CampaignState => {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as Partial<CampaignState>;
  return (
    state.version === 3 &&
    typeof state.startedAt === 'number' &&
    Number.isInteger(state.dayIndex) &&
    (state.missionId === null || typeof state.missionId === 'string') &&
    Array.isArray(state.doneMissionIds) &&
    typeof state.cargo?.regolithKg === 'number' &&
    typeof state.cargo.bricks === 'number' &&
    typeof state.knowledge === 'number' &&
    isPercent(state.stores?.food) &&
    STAGES.some((stage) => stage === state.stage) &&
    isPercent(state.stores?.air) &&
    isPercent(state.stores?.power) &&
    isPercent(state.stores?.water) &&
    Array.isArray(state.history)
  );
};

/** Reads the saved game; undefined when there is none or it cannot be used. */
export const loadCampaign = (): CampaignState | undefined => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (isCampaign(parsed)) return parsed;
    console.warn('[scenario] save reset', { reason: 'invalid' });
  } catch (error) {
    console.warn('[scenario] save reset', { reason: String(error) });
  }
  return undefined;
};

/** Saves the game; the game goes on in memory when the browser refuses. */
export const saveCampaign = (state: CampaignState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    console.warn('[scenario] storage unavailable');
  }
};

/** Forgets the saved game, so that the next screen starts a new one. */
export const clearCampaign = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    console.warn('[scenario] storage unavailable');
  }
};
