import { actOutcome } from '../core/act-outcome';
import { endDay } from '../core/end-day';
import { renderCrew } from './crew.view';
import { renderEvent } from './event.view';
import { renderForecast } from './forecast.view';
import { renderJobLegend } from './job-legend.view';
import { showDayReport } from './report.view';
import { renderStatus } from './status.view';
import { showActEnd } from './act-end.view';
import type { BaseState } from '../core/base-state';
import type { DayPlan } from '../core/plan-day';

export type MoonBaseElements = {
  status: HTMLElement;
  event: HTMLElement;
  crew: HTMLElement;
  jobsHelp: HTMLElement;
  forecast: HTMLElement;
  endButton: HTMLButtonElement;
  report: HTMLDialogElement;
  actEnd: HTMLDialogElement;
};

/** Where the base is kept between page loads, and how to start the act again. */
export type MoonBaseStore = { save: (state: BaseState) => void; restart: () => BaseState };

/** Everyone keeps yesterday's job if they can, so that the player only changes what matters. */
const planFrom = (state: BaseState): DayPlan => ({
  jobs: state.history.at(-1)?.jobs ?? Object.fromEntries(state.crew.map(({ id }) => [id, 'rest'])),
});

/**
 * Runs the base management screen of the Moon act: the player gives each astronaut a job (and
 * answers the solar storm), sees what the day will do, ends it, reads its report, and plays on
 * until the crew is ready for Mars, must fly home, or the demo days are over.
 */
export const mountMoonBase = (
  elements: MoonBaseElements,
  start: BaseState,
  store: MoonBaseStore,
) => {
  let state = start;
  let plan = planFrom(state);
  renderJobLegend(elements.jobsHelp);
  const render = () => {
    renderStatus(elements.status, state);
    renderEvent(elements.event, state, plan, (storm) => {
      plan = { ...plan, storm };
      render();
    });
    renderCrew(elements.crew, state, plan, (id, job) => {
      plan = { ...plan, jobs: { ...plan.jobs, [id]: job } };
      render();
    });
    renderForecast(elements.forecast, elements.endButton, state, plan);
  };
  const finishIfOver = () => {
    const outcome = actOutcome(state);
    if (outcome === 'playing') return;
    showActEnd(elements.actEnd, outcome, state, () => {
      state = store.restart();
      plan = planFrom(state);
      elements.actEnd.close();
      render();
    });
  };
  elements.endButton.addEventListener('click', () => {
    const played = endDay(state, plan);
    state = played.state;
    plan = planFrom(state);
    store.save(state);
    showDayReport(elements.report, played.report, () => {
      render();
      finishIfOver();
    });
  });
  render();
  finishIfOver();
};
