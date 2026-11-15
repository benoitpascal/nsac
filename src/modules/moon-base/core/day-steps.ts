import { addStocks, qualityOf } from './campaign';
import type { Campaign, Quality, Stocks } from './campaign';

/** Kilograms of regolith in one unit, and the units the day 1 robot mission asks for. */
export const REGOLITH = { kgPerUnit: 10, goalUnits: 5 };

/** What a night costs the base: the crew breathes, drinks and eats, the base draws power. */
const NIGHT: Partial<Stocks> = { energy: -5, oxygen: -5, water: -5, food: -5 };

/** What the printer turns into materials, per unit of regolith, and the knowledge it brings. */
const PRINTING: Record<Quality, { share: number; knowledge: number }> = {
  optimal: { share: 1, knowledge: 10 },
  partial: { share: 0.6, knowledge: 6 },
  failed: { share: 0.3, knowledge: 3 },
};

/** Power the 3D printer draws for a day's printing (%). */
const PRINTER_ENERGY = 20;

/** Closes the day: the night's needs are taken, and the debrief gets the day's result. */
export const closeDay = (campaign: Campaign, extraNights: number): Campaign => {
  let stocks = campaign.stocks;
  for (let night = 0; night <= extraNights; night += 1) stocks = addStocks(stocks, NIGHT);
  return {
    ...campaign,
    stage: 'debrief',
    stocks,
    lastDay: { day: campaign.day, before: campaign.dayStart, after: stocks, notes: campaign.notes },
  };
};

/** Which of day 1's two tasks are done. */
export const dayOneTasks = (campaign: Campaign) => ({
  robot: campaign.notes.some((note) => note === 'robotBack' || note === 'robotStranded'),
  printer: campaign.printer !== undefined,
});

/**
 * Ends day 1 once both tasks are done: the calibrated printer turns the regolith into materials
 * (more of it when well tuned), and a stuck robot's towing costs one more night.
 */
const finishDayOne = (campaign: Campaign): Campaign => {
  const tasks = dayOneTasks(campaign);
  if (!tasks.robot || !campaign.printer) return campaign;
  const { regolith } = campaign.stocks;
  const printed = Math.floor(regolith * PRINTING[campaign.printer].share);
  const stocks = addStocks(campaign.stocks, { regolith: -regolith, materials: printed });
  const stranded = campaign.notes.includes('robotStranded');
  return closeDay({ ...campaign, stocks }, stranded ? 1 : 0);
};

/**
 * The robot mission is over: the regolith it brought is stored. A robot stuck without power is
 * towed back by the crew, which costs the next day (no game over).
 */
export const robotDone = (campaign: Campaign, deliveredKg: number, stranded: boolean): Campaign => {
  const units = Math.floor(deliveredKg / REGOLITH.kgPerUnit);
  return finishDayOne({
    ...campaign,
    stocks: addStocks(campaign.stocks, { regolith: units, knowledge: stranded ? 5 : 10 }),
    notes: [...campaign.notes, stranded ? 'robotStranded' : 'robotBack'],
  });
};

/** The printer was calibrated, before or after the robot mission: its quality is kept. */
export const calibrationDone = (campaign: Campaign, score: number): Campaign => {
  const quality = qualityOf(score);
  return finishDayOne({
    ...campaign,
    printer: quality,
    stocks: addStocks(campaign.stocks, {
      energy: -PRINTER_ENERGY,
      knowledge: PRINTING[quality].knowledge,
    }),
    notes: [...campaign.notes, `calibration:${quality}`],
  });
};

/** Starts the next day from the debrief: a stuck robot's recovery used up one more day. */
export const nextDay = (campaign: Campaign, stage: Campaign['stage']): Campaign => {
  const recovery = campaign.lastDay?.notes.includes('robotStranded') ? 1 : 0;
  return {
    ...campaign,
    day: campaign.day + 1 + recovery,
    stage,
    dayStart: campaign.stocks,
    notes: [],
  };
};
