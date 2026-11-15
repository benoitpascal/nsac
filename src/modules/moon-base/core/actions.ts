import { addStocks, qualityOf } from './campaign';
import { closeDay } from './day-steps';
import type { Campaign, Quality, Stocks } from './campaign';

/** What the commander can launch on day 2. */
export type ActionId = 'shelter' | 'workshop' | 'greenhouse' | 'research';

/** Actions in the order the planning screen lists them. */
export const ACTION_ORDER: readonly ActionId[] = ['shelter', 'workshop', 'greenhouse', 'research'];

/**
 * What each action needs in stock and takes, and what it gives. The demo's stocks only allow the
 * shelter, which the scenario steers to; the others stay visible, greyed, to show other
 * strategies. Gameplay values, see DATA.md.
 */
export const ACTIONS: Record<ActionId, { cost: Partial<Stocks>; gives: Partial<Stocks> }> = {
  shelter: { cost: { materials: 4, energy: 10 }, gives: { knowledge: 10 } },
  workshop: { cost: { materials: 12, energy: 10 }, gives: { knowledge: 10 } },
  greenhouse: { cost: { water: 60, energy: 10 }, gives: { food: 20 } },
  research: { cost: { energy: 70 }, gives: { knowledge: 25 } },
};

/** The stocks an action is missing, with how much more of each it needs. */
export const missingFor = (stocks: Stocks, action: ActionId): Partial<Stocks> =>
  Object.fromEntries(
    (Object.entries(ACTIONS[action].cost) as [keyof Stocks, number][])
      .filter(([key, amount]) => stocks[key] < amount)
      .map(([key, amount]) => [key, amount - stocks[key]]),
  );

/** Whether the base has everything the action needs. */
export const canAfford = (stocks: Stocks, action: ActionId): boolean =>
  Object.keys(missingFor(stocks, action)).length === 0;

const pay = (stocks: Stocks, cost: Partial<Stocks>) =>
  addStocks(
    stocks,
    Object.fromEntries(Object.entries(cost).map(([key, amount]) => [key, -amount])),
  );

/**
 * Launches an action: the shelter is then built in a mini-game; any other action is done at once
 * and closes the day.
 */
export const launchAction = (campaign: Campaign, action: ActionId): Campaign => {
  const stocks = pay(campaign.stocks, ACTIONS[action].cost);
  const notes = [...campaign.notes, `action:${action}`];
  if (action === 'shelter') return { ...campaign, stage: 'construction', stocks, notes };
  return closeDay({ ...campaign, stocks: addStocks(stocks, ACTIONS[action].gives), notes }, 0);
};

/** Extra materials the building takes beyond its cost, and knowledge gained, per quality. */
const BUILDING: Record<Quality, { extraMaterials: number; knowledge: number }> = {
  optimal: { extraMaterials: 0, knowledge: 10 },
  partial: { extraMaterials: 2, knowledge: 6 },
  failed: { extraMaterials: 2, knowledge: 3 },
};

/**
 * The shelter is built: done with little waste, done with extra materials, or left unfinished
 * with materials lost that will have to be gathered again.
 */
export const shelterDone = (campaign: Campaign, score: number): Campaign => {
  const quality = qualityOf(score);
  const stocks = addStocks(campaign.stocks, {
    materials: -BUILDING[quality].extraMaterials,
    knowledge: BUILDING[quality].knowledge,
  });
  return closeDay(
    { ...campaign, stocks, shelter: quality, notes: [...campaign.notes, `shelter:${quality}`] },
    0,
  );
};
