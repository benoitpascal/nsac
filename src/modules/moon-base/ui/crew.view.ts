import { MAX_FATIGUE, isExhausted } from '../core/crew';
import { JOB_ORDER } from '../core/jobs';
import { doableJob } from '../core/plan-day';
import { element } from './element';
import { JOB_TEXTS, SPECIALTY_TEXTS } from './texts';
import type { BaseState } from '../core/base-state';
import type { Astronaut } from '../core/crew';
import type { Job } from '../core/jobs';
import type { DayPlan } from '../core/plan-day';

const fatigueText = (astronaut: Astronaut) =>
  isExhausted(astronaut)
    ? 'Exhausted: must rest'
    : `Tiredness ${astronaut.fatigue} / ${MAX_FATIGUE}`;

/** A job button: pressed when it is the job done today, disabled when it cannot be done today. */
const jobButton = (
  state: BaseState,
  plan: DayPlan,
  astronaut: Astronaut,
  job: Job,
  onPick: (job: Job) => void,
) => {
  const button = element('button', 'base-job', JOB_TEXTS[job].label);
  button.type = 'button';
  button.title = JOB_TEXTS[job].help;
  const doable = doableJob(state, astronaut, { ...plan, jobs: { [astronaut.id]: job } }) === job;
  button.setAttribute('aria-pressed', String(job === doableJob(state, astronaut, plan)));
  button.disabled = !doable;
  button.addEventListener('click', () => onPick(job));
  return button;
};

/**
 * Shows one row per astronaut: name, specialty, tiredness, and a button per job with the one
 * they will really do pressed (an exhausted or sheltered astronaut rests whatever was asked).
 */
export const renderCrew = (
  list: HTMLElement,
  state: BaseState,
  plan: DayPlan,
  onPick: (astronautId: string, job: Job) => void,
) => {
  list.replaceChildren(
    ...state.crew.map((astronaut) => {
      const item = element('li', 'base-astronaut');
      const who = element('div', 'base-astronaut__who');
      who.append(
        element('span', 'base-astronaut__name', astronaut.name),
        element('small', 'base-astronaut__specialty', SPECIALTY_TEXTS[astronaut.specialty]),
        element('small', 'base-astronaut__fatigue', fatigueText(astronaut)),
      );
      const jobs = element('div', 'base-astronaut__jobs');
      jobs.setAttribute('role', 'group');
      jobs.setAttribute('aria-label', `Job for ${astronaut.name}`);
      jobs.append(
        ...JOB_ORDER.map((job) =>
          jobButton(state, plan, astronaut, job, (picked) => onPick(astronaut.id, picked)),
        ),
      );
      item.append(who, jobs);
      return item;
    }),
  );
};
