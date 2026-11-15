/** The base's stocks: shares (%) of power, oxygen, water and food, and counted materials. */
export type Stocks = {
  energy: number;
  oxygen: number;
  water: number;
  food: number;
  /** Building materials printed from regolith (units). */
  materials: number;
  /** Regolith waiting to be printed (units, 1 unit = 10 kg). */
  regolith: number;
  knowledge: number;
};

/** How well a mini-game went. */
export type Quality = 'optimal' | 'partial' | 'failed';

/**
 * Where the demo stands: day 1's two tasks (robot and printer, in any order), its debrief, the day
 * 2 planning and construction, then the day 3 alert.
 */
export type Stage = 'dayOne' | 'debrief' | 'planning' | 'construction' | 'alert';

/** What a finished day leaves for its debrief: stocks before and after, and what happened. */
export type DayResult = { day: number; before: Stocks; after: Stocks; notes: string[] };

/** Everything the demo keeps from one screen to the next. */
export type Campaign = {
  /** Day being played, from 1. */
  day: number;
  stage: Stage;
  stocks: Stocks;
  /** Stocks at the start of the current day, for its debrief. */
  dayStart: Stocks;
  /** Notes of the current day (codes the UI turns into sentences). */
  notes: string[];
  lastDay?: DayResult;
  /** How well the 3D printer was calibrated on day 1, once done. */
  printer?: Quality;
  shelter?: Quality;
};

/** Length of the Moon act (days): the knowledge goal must be reached before it ends. */
export const ACT_DAYS = 30;

/** Stocks when the commander lands (gameplay values, see DATA.md). */
const START_STOCKS: Stocks = {
  energy: 85,
  oxygen: 100,
  water: 60,
  food: 70,
  materials: 4,
  regolith: 0,
  knowledge: 0,
};

/** The demo on the morning of day 1, before any task. */
export const startCampaign = (): Campaign => ({
  day: 1,
  stage: 'dayOne',
  stocks: { ...START_STOCKS },
  dayStart: { ...START_STOCKS },
  notes: [],
});

/** Returns the stocks changed by the given amounts, shares kept between 0 and 100 %. */
export const addStocks = (stocks: Stocks, change: Partial<Stocks>): Stocks => {
  const share = (value: number) => Math.min(100, Math.max(0, value));
  const next = { ...stocks };
  for (const [key, amount] of Object.entries(change) as [keyof Stocks, number][])
    next[key] += amount;
  return {
    ...next,
    energy: share(next.energy),
    oxygen: share(next.oxygen),
    water: share(next.water),
    food: share(next.food),
    materials: Math.max(0, next.materials),
    regolith: Math.max(0, next.regolith),
  };
};

/** Returns the quality a mini-game score (0–100) gives. */
export const qualityOf = (score: number): Quality =>
  score >= 70 ? 'optimal' : score >= 40 ? 'partial' : 'failed';
