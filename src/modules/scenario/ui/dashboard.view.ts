import { dayObjectives } from '../core/progress';
import { controlRow } from './control-row.view';
import { renderGauges } from './gauges.view';
import { cutButton, el } from './dom';
import type { CampaignState } from '../core/campaign';
import type { Objective } from '../core/progress';
import type { Act } from '../core/scenario-content';

export type DashboardActions = { launch: () => void; back: () => void; leave: () => void };

const CHECK =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Renders the day's objectives as a checklist. */
export const renderObjectives = (objectives: readonly Objective[]) => {
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
  stores.append(el('h2', 'station-board__title', 'Base resources'), renderGauges(state.stores));
  const panels = el('div', 'station-board__panels');
  panels.append(objectives, stores);
  const row = controlRow({
    back: actions.back,
    leave: actions.leave,
    actions: [cutButton('Launch mission', 'wide', actions.launch, 'station-board__launch')],
  });
  const board = el('div', 'station-board');
  board.append(panels, row);
  return board;
};
