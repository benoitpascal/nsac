import { dayObjectives } from '../core/progress';
import { renderGauges } from './gauges.view';
import { button, el } from './dom';
import type { CampaignState } from '../core/campaign';
import type { Objective } from '../core/progress';
import type { Act } from '../core/scenario-content';

export type DashboardActions = { launch: () => void; explore: () => void; newGame: () => void };

const CHECK =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const renderObjectives = (objectives: readonly Objective[]) => {
  const list = el('ul', 'board-objectives');
  for (const objective of objectives) {
    const item = el('li', 'board-objective');
    item.classList.toggle('board-objective--done', objective.done);
    item.classList.toggle('board-objective--current', objective.current);
    const box = el('span', 'board-objective__box');
    if (objective.done) box.innerHTML = CHECK;
    item.append(
      box,
      el('span', 'visually-hidden', objective.done ? 'Done: ' : 'To do: '),
      el('span', 'board-objective__text', objective.text),
    );
    list.append(item);
  }
  return list;
};

/**
 * The station dashboard (Figma « Ecran - Dashboard - Current objectives »): today's objectives,
 * the base resources, and the main buttons.
 */
export const renderDashboard = (state: CampaignState, act: Act, actions: DashboardActions) => {
  const objectives = el('section', 'station-board__panel');
  objectives.append(
    el('h2', 'station-board__title', 'Current objectives'),
    renderObjectives(dayObjectives(act, state)),
  );
  const stores = el('section', 'station-board__panel');
  stores.append(
    el('h2', 'station-board__title', 'Base resources'),
    renderGauges(state.stores),
    el(
      'p',
      'station-board__cargo',
      `Regolith ${Math.floor(state.cargo.regolithKg)} kg · Bricks ${state.cargo.bricks} · Knowledge ${state.knowledge}`,
    ),
  );
  const panels = el('div', 'station-board__panels');
  panels.append(objectives, stores);
  let confirming = false;
  const reset = button('New game', 'hud-secondary', () => {
    if (confirming) return actions.newGame();
    confirming = true;
    reset.textContent = 'Sure? Start over';
  });
  const row = el('div', 'station-board__actions');
  row.append(
    button('Back to the base', 'hud-secondary', actions.explore),
    reset,
    button('Launch mission', 'hud-action station-board__launch', actions.launch),
  );
  const board = el('div', 'station-board');
  board.append(panels, row);
  return board;
};
