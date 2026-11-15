import { renderGauges } from './gauges.view';
import { button, el } from './dom';
import type { CampaignState } from '../core/campaign';
import type { Mission } from '../core/scenario-content';

export type DashboardActions = { launch: () => void; explore: () => void; newGame: () => void };

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** The station dashboard: day and date, today's goal, the three gauges, and the main buttons. */
export const renderDashboard = (
  state: CampaignState,
  date: number,
  mission: Mission,
  actions: DashboardActions,
) => {
  const panel = el('section', 'hud-panel briefing__orders');
  const day = el('div', 'briefing__day');
  day.append(
    el('p', 'briefing__day-label', `Day ${String(state.dayIndex + 1).padStart(2, '0')}`),
    el('p', 'briefing__place', `Moon base · ${dateFormat.format(date)}`),
  );
  const goal = el('section', 'hud-panel');
  goal.append(
    el('h3', 'hud-panel__heading', `Mission · ${mission.title}`),
    el('p', 'briefing__text', mission.goal),
  );
  const stores = el('section', 'hud-panel');
  stores.append(
    el('h3', 'hud-panel__heading', 'Base resources'),
    renderGauges(state.stores),
    el(
      'p',
      'briefing__text',
      `Regolith ${Math.floor(state.cargo.regolithKg)} kg · Bricks ${state.cargo.bricks}`,
    ),
  );
  const panels = el('div', 'briefing__panels');
  panels.append(goal, stores);
  let confirming = false;
  const reset = button('New game', 'hud-secondary guide__back', () => {
    if (confirming) return actions.newGame();
    confirming = true;
    reset.textContent = 'Sure? Start over';
  });
  const row = el('div', 'guide__actions');
  row.append(
    button('Back to the base', 'hud-action hud-action--back', actions.explore),
    reset,
    button('Launch mission', 'hud-action', actions.launch),
  );
  panel.append(day, panels, row);
  return panel;
};
