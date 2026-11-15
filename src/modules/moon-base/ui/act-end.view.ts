import { JOB_ORDER } from '../core/jobs';
import { ACT_END_TEXTS, REAL_FACT } from './act-end-texts';
import { element } from './element';
import { JOB_TEXTS } from './texts';
import type { ActOutcome } from '../core/act-outcome';
import type { BaseState, DayRecord } from '../core/base-state';

const STORM_WORDS = { shelter: ' · storm: shelter', work: ' · storm: kept working' };

/** One line per played day: how many astronauts did each job, and the storm choice. */
const dayLine = (record: DayRecord) => {
  const jobs = Object.values(record.jobs);
  const counts = JOB_ORDER.map((job) => [job, jobs.filter((done) => done === job).length] as const)
    .filter(([, count]) => count > 0)
    .map(([job, count]) => `${count} ${JOB_TEXTS[job].label}`);
  const storm = record.storm ? STORM_WORDS[record.storm] : '';
  return `Day ${record.day}: ${counts.join(', ')}${storm} · +${record.knowledge} knowledge`;
};

const actionLink = (label: string, href: string) => {
  const link = element('a', 'hud-action', label);
  link.href = href;
  return link;
};

/**
 * Shows the end of the act: what happened and why, what would have helped, a real fact, the
 * choices of every day, and buttons to play again or go back to the missions.
 */
export const showActEnd = (
  dialog: HTMLDialogElement,
  outcome: Exclude<ActOutcome, 'playing'>,
  state: BaseState,
  onReplay: () => void,
) => {
  const text = ACT_END_TEXTS[outcome](state);
  const days = element('ul', 'base-end__days');
  days.append(...state.history.map((record) => element('li', 'base-end__day', dayLine(record))));
  const fact = element('p', 'base-end__fact', `${REAL_FACT.text} `);
  const source = element('a', 'base-event__link', 'NASA — Apollo 17');
  source.href = REAL_FACT.url;
  source.target = '_blank';
  source.rel = 'noopener';
  fact.append(source);
  const replay = element('button', 'hud-back', 'Play the 5 days again');
  replay.type = 'button';
  replay.addEventListener('click', onReplay);
  const actions = element('div', 'base-end__actions');
  actions.append(replay, actionLink('Back to missions', '/missions.html'));
  dialog.dataset.outcome = outcome;
  dialog.replaceChildren(
    element('h2', 'base-dialog__title', text.title),
    element('p', 'base-end__story', text.story),
    ...(text.tip ? [element('p', 'base-end__tip', `What would help: ${text.tip}`)] : []),
    fact,
    element('h3', 'base-end__heading', 'Your choices'),
    days,
    actions,
  );
  dialog.addEventListener('cancel', (event) => event.preventDefault());
  dialog.showModal();
};
