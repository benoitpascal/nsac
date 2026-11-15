import { daysLeft } from '../core/act-outcome';
import { BASE } from '../core/base-state';
import { CAMPAIGN_DAYS, DEMO_DAYS } from '../core/demo-days';
import { bar, element } from './element';
import type { BaseState } from '../core/base-state';

const whole = (value: number) => String(Math.floor(value));

const row = (name: string, value: string, level: HTMLElement, hint?: string) => {
  const item = element('li', 'base-resource');
  item.append(
    element('span', 'base-resource__name', name),
    element('span', 'base-resource__value', value),
    level,
  );
  if (hint) item.append(element('small', 'base-resource__hint', hint));
  return item;
};

/** Shows the day and the base's stocks: power, oxygen and food, and the knowledge gathered for Mars. */
export const renderStatus = (panel: HTMLElement, state: BaseState) => {
  const left = daysLeft(state);
  const day = Math.min(state.day, DEMO_DAYS.length);
  const list = element('ul', 'base-resources');
  list.append(
    row(
      'Power stored',
      `${whole(state.batteryKwh)} / ${BASE.batteryCapacityKwh} kWh`,
      bar(state.batteryKwh, BASE.batteryCapacityKwh),
      'kWh is how we count electricity.',
    ),
    row('Oxygen', `${whole(state.oxygenKg)} kg · ${whole(left.oxygen)} days`, bar(left.oxygen, 5)),
    row('Food', `${whole(state.foodKg)} kg · ${whole(left.food)} days`, bar(left.food, 5)),
    row(
      'Knowledge for Mars',
      `${whole(state.knowledge)} / ${BASE.knowledgeForMars}`,
      bar(state.knowledge, BASE.knowledgeForMars, 'base-bar base-bar--goal'),
    ),
  );
  panel.replaceChildren(
    element('p', 'base-status__day', `Day ${day} / ${DEMO_DAYS.length}`),
    element(
      'p',
      'base-status__note',
      `The demo plays ${DEMO_DAYS.length} of the ${CAMPAIGN_DAYS} days at the base.`,
    ),
    list,
  );
};
