import { BASE } from '../core/base-state';
import { planEffects, planProblem } from '../core/plan-day';
import { element } from './element';
import type { BaseState } from '../core/base-state';
import type { DayPlan } from '../core/plan-day';

const PROBLEM_TEXTS = {
  power:
    'Not enough power for this plan. Use fewer power jobs, or send someone to the solar panels.',
  storm: 'Choose what the crew does during the solar storm first.',
};

const line = (text: string) => element('li', 'base-forecast__line', text);

/**
 * Shows what the planned day will do before it is played: power made and used, what is left in
 * the battery (and what a full battery cannot keep), oxygen, food planted and knowledge. Enables
 * the end-of-day button only when the plan can be played.
 */
export const renderForecast = (
  panel: HTMLElement,
  endButton: HTMLButtonElement,
  state: BaseState,
  plan: DayPlan,
) => {
  const effects = planEffects(state, plan);
  const problem = planProblem(state, plan);
  const kept = Math.min(Math.max(effects.batteryAfterKwh, 0), BASE.batteryCapacityKwh);
  const lost = Math.max(0, effects.batteryAfterKwh - BASE.batteryCapacityKwh);
  const list = element('ul', 'base-forecast__lines');
  list.append(
    line(
      `Solar panels make ${effects.solarKwh} kWh. The base and the jobs use ${effects.usedKwh} kWh.`,
    ),
    line(`Battery tonight: ${Math.floor(kept)} kWh.${lost > 0 ? ` Full: ${lost} kWh lost!` : ''}`),
    line(`Oxygen: +${effects.oxygenMadeKg} kg made, ${BASE.oxygenPerDayKg} kg breathed.`),
    line(
      `Food: ${BASE.foodPerDayKg} kg eaten.${effects.foodPlantedKg > 0 ? ` ${effects.foodPlantedKg} kg planted.` : ''}`,
    ),
    line(`Knowledge: +${effects.knowledge}.`),
  );
  panel.replaceChildren(element('h2', 'hud-panel__heading', "Today's plan"), list);
  if (problem) panel.append(element('p', 'base-forecast__problem', PROBLEM_TEXTS[problem]));
  endButton.disabled = problem !== undefined;
};
