import { spend } from './base-stores';
import type { BaseStores } from './base-stores';
import type { CampaignState } from './campaign';
import type { Act } from './scenario-content';

/** What the commander can launch when planning a day. */
export type ActionId = 'shelter' | 'workshop' | 'greenhouse' | 'research';

/** What an action needs and takes: vital stores (points) and bricks. */
export type ActionCost = Partial<BaseStores> & { bricks?: number };

/** What an action gives at once: stores (points) and knowledge. */
export type ActionGain = Partial<BaseStores> & { knowledge?: number };

/** Actions in the order the planning lists them. */
export const ACTION_ORDER: readonly ActionId[] = ['shelter', 'workshop', 'greenhouse', 'research'];

/**
 * What each action costs and gives, from the validated scenario (see DATA.md). The shelter and the
 * greenhouse are then done in a mission (its result gives the food); the others are done at once.
 */
export const ACTIONS: Record<
  ActionId,
  { cost: ActionCost; gives: ActionGain; missionId?: string }
> = {
  shelter: { cost: { bricks: 4, power: 10 }, gives: {}, missionId: 'shelter' },
  workshop: { cost: { bricks: 12, power: 10 }, gives: { knowledge: 10 } },
  greenhouse: { cost: { water: 60, power: 10 }, gives: {}, missionId: 'greenhouse' },
  research: { cost: { power: 70 }, gives: { knowledge: 25 } },
};

const have = (state: CampaignState, key: keyof ActionCost) =>
  key === 'bricks' ? state.cargo.bricks : state.stores[key];

/** Returns what the base is missing for an action, and how much of each. */
export const missingFor = (state: CampaignState, action: ActionId): ActionCost =>
  Object.fromEntries(
    (Object.entries(ACTIONS[action].cost) as [keyof ActionCost, number][])
      .filter(([key, amount]) => have(state, key) < amount)
      .map(([key, amount]) => [key, Math.round((amount - have(state, key)) * 10) / 10]),
  );

/** Whether the base has everything the action needs. */
export const canAfford = (state: CampaignState, action: ActionId): boolean =>
  Object.keys(missingFor(state, action)).length === 0;

/**
 * Launches an action from the planning: pays its cost; the shelter and the greenhouse then
 * open their mission's academy, any other action gives its gain at once and ends the day. Unaffordable actions, or a
 * call outside the planning, leave the game unchanged.
 */
export const chooseAction = (state: CampaignState, act: Act, action: ActionId): CampaignState => {
  if (state.stage !== 'planning' || !canAfford(state, action)) return state;
  const { cost, gives, missionId } = ACTIONS[action];
  const { bricks = 0, ...stores } = cost;
  const { knowledge = 0, ...gained } = gives;
  const paid = {
    ...state,
    cargo: { ...state.cargo, bricks: state.cargo.bricks - bricks },
    stores: spend(state.stores, stores),
  };
  const mission = act.days[state.dayIndex]?.missions.find(
    (candidate) => candidate.id === missionId,
  );
  if (mission) return { ...paid, stage: 'academy', missionId: mission.id };
  const negative = Object.fromEntries(Object.entries(gained).map(([key, value]) => [key, -value]));
  return {
    ...paid,
    stage: 'dayClosing',
    stores: spend(paid.stores, negative),
    knowledge: state.knowledge + knowledge,
  };
};
