import { ACTIONS, ACTION_ORDER, canAfford, missingFor } from '../core/actions';
import { element } from './element';
import { ACTION_TEXTS, STOCK_TEXTS } from './texts';
import type { ActionId } from '../core/actions';
import type { Stocks } from '../core/campaign';

/** Lists amounts as "4 materials · 10% power". */
const amounts = (stocks: Partial<Stocks>) =>
  (Object.entries(stocks) as [keyof Stocks, number][])
    .map(([key, amount]) => {
      const { name, unit } = STOCK_TEXTS[key];
      return unit === '%'
        ? `${amount}% ${name.toLowerCase()}`
        : `${amount}${unit} of ${name.toLowerCase()}`;
    })
    .join(' · ');

const actionCard = (stocks: Stocks, action: ActionId, onLaunch: (action: ActionId) => void) => {
  const affordable = canAfford(stocks, action);
  const card = element('li', 'plan-action');
  card.dataset.state = affordable ? 'open' : 'locked';
  card.append(
    element('h3', 'plan-action__title', ACTION_TEXTS[action].title),
    element('p', 'plan-action__text', ACTION_TEXTS[action].text),
    element('p', 'plan-action__cost', `Costs ${amounts(ACTIONS[action].cost)}`),
  );
  if (action === 'shelter')
    card.prepend(element('span', 'plan-action__badge', 'Mission control advises'));
  if (!affordable)
    card.append(
      element(
        'p',
        'plan-action__missing',
        `Not enough: missing ${amounts(missingFor(stocks, action))}`,
      ),
    );
  const launch = element(
    'button',
    'hud-action plan-action__launch',
    affordable ? 'Launch' : 'Locked',
  );
  launch.type = 'button';
  launch.disabled = !affordable;
  launch.addEventListener('click', () => onLaunch(action));
  card.append(launch);
  return card;
};

/** Shows the base's stocks, then every action with its cost; unaffordable ones stay visible, greyed. */
export const renderPlanning = (
  elements: { day: HTMLElement; stocks: HTMLElement; actions: HTMLElement },
  day: number,
  stocks: Stocks,
  onLaunch: (action: ActionId) => void,
) => {
  elements.day.textContent = String(day).padStart(2, '0');
  elements.stocks.replaceChildren(
    ...(Object.keys(STOCK_TEXTS) as (keyof Stocks)[])
      .filter((key) => key !== 'regolith')
      .map((key) => {
        const row = element('li', 'plan-stock');
        row.append(
          element('span', 'plan-stock__name', STOCK_TEXTS[key].name),
          element('span', 'plan-stock__value', `${stocks[key]}${STOCK_TEXTS[key].unit}`),
        );
        return row;
      }),
  );
  elements.actions.replaceChildren(
    ...ACTION_ORDER.map((action) => actionCard(stocks, action, onLaunch)),
  );
};
