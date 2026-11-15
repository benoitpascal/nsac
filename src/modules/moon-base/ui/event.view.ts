import { labShielded } from '../core/base-state';
import { DEMO_DAYS, STORM_SOURCE } from '../core/demo-days';
import { element } from './element';
import { STORM_CHOICES, STORM_DATA_TEXT, shieldText } from './storm-texts';
import { DAY_MESSAGES } from './texts';
import type { BaseState, StormChoice } from '../core/base-state';
import type { DayPlan } from '../core/plan-day';

const stormChoices = (plan: DayPlan, onStorm: (choice: StormChoice) => void) => {
  const group = element('div', 'base-event__choices');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'What does the crew do during the storm?');
  for (const choice of ['shelter', 'work'] as const) {
    const button = element('button', 'base-choice');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(plan.storm === choice));
    button.append(
      element('strong', 'base-choice__label', STORM_CHOICES[choice].label),
      element('small', 'base-choice__cost', STORM_CHOICES[choice].cost),
    );
    button.addEventListener('click', () => onStorm(choice));
    group.append(button);
  }
  return group;
};

const stormSource = () => {
  const source = element('p', 'base-event__source', `${STORM_DATA_TEXT} `);
  const link = element('a', 'base-event__link', STORM_SOURCE.dataset);
  link.href = STORM_SOURCE.url;
  link.target = '_blank';
  link.rel = 'noopener';
  source.append(link);
  return source;
};

/** Shows the crew's message of the day and, on the storm day, the choice with the real data behind it. */
export const renderEvent = (
  panel: HTMLElement,
  state: BaseState,
  plan: DayPlan,
  onStorm: (choice: StormChoice) => void,
) => {
  const message = DAY_MESSAGES[state.day - 1];
  if (!message) return;
  const event = DEMO_DAYS[state.day - 1]?.event;
  panel.dataset.event = event ?? 'none';
  panel.replaceChildren(
    element('h2', 'hud-panel__heading', message.title),
    element('p', 'base-event__text', message.text),
  );
  if (event !== 'storm') return;
  panel.append(
    element('p', 'base-event__shield', shieldText(labShielded(state), state.regolithKg)),
    stormChoices(plan, onStorm),
    stormSource(),
  );
};
