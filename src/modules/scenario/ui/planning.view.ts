import { ACTION_ORDER, ACTIONS, canAfford, missingFor } from '../core/actions';
import { button, el } from './dom';
import type { ActionCost, ActionGain, ActionId } from '../core/actions';
import type { CampaignState } from '../core/campaign';

/** What each action is called and does, in one short line for children. */
const ACTION_TEXTS: Record<ActionId, { title: string; text: string }> = {
  shelter: { title: 'Build a shelter', text: 'Thick walls to protect the crew from danger.' },
  workshop: { title: 'Improve the workshop', text: 'Better printers make more bricks.' },
  greenhouse: { title: 'Grow the greenhouse', text: 'More plants for more food later.' },
  research: { title: 'Invest in research', text: 'Study the Moon to prepare for Mars.' },
};

const UNITS: Record<string, (amount: number) => string> = {
  bricks: (amount) => `${amount} bricks`,
  knowledge: (amount) => `${amount} knowledge`,
};

/** Lists amounts as « 4 bricks · 10 power ». */
const amounts = (values: ActionCost | ActionGain) =>
  Object.entries(values)
    .map(([key, amount]) => UNITS[key]?.(amount) ?? `${amount} ${key}`)
    .join(' · ');

const actionCard = (
  state: CampaignState,
  action: ActionId,
  onLaunch: (action: ActionId) => void,
) => {
  const affordable = canAfford(state, action);
  const { cost, gives } = ACTIONS[action];
  const card = el('li', `hud-panel plan-action plan-action--${affordable ? 'open' : 'locked'}`);
  if (action === 'shelter')
    card.append(el('span', 'plan-action__badge', 'Mission control advises'));
  card.append(
    el('h3', 'plan-action__title', ACTION_TEXTS[action].title),
    el('p', 'plan-action__text', ACTION_TEXTS[action].text),
    el('p', 'plan-action__cost', `Costs ${amounts(cost)}`),
  );
  if (Object.keys(gives).length > 0)
    card.append(el('p', 'plan-action__gain', `Gives ${amounts(gives)}`));
  if (!affordable)
    card.append(
      el('p', 'plan-action__missing', `Not enough: missing ${amounts(missingFor(state, action))}`),
    );
  const launch = button(affordable ? 'Launch' : 'Locked', 'hud-action plan-action__launch', () =>
    onLaunch(action),
  );
  launch.disabled = !affordable;
  card.append(launch);
  return card;
};

/**
 * The day's plan: the base's stores, bricks and knowledge on one line, then every action with its cost and
 * gain; actions the base cannot pay stay visible, greyed, with what they are missing.
 */
export const renderPlanning = (state: CampaignState, onLaunch: (action: ActionId) => void) => {
  const panel = el('section', 'hud-panel planning');
  const actions = el('ul', 'planning__actions');
  actions.append(...ACTION_ORDER.map((action) => actionCard(state, action, onLaunch)));
  panel.append(
    el('h2', 'planning__title', 'Plan the day'),
    el(
      'p',
      'planning__cargo',
      `Air ${state.stores.air} % · Power ${state.stores.power} % · Water ${state.stores.water} % · Food ${state.stores.food} % · Bricks ${state.cargo.bricks} · Knowledge ${state.knowledge}`,
    ),
    actions,
  );
  return panel;
};
