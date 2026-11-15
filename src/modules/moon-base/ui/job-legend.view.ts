import { JOB_ORDER, JOB_RULES } from '../core/jobs';
import { element } from './element';
import { JOB_TEXTS } from './texts';
import type { Job } from '../core/jobs';

const UNITS: Record<Exclude<Job, 'rest'>, string> = {
  research: 'knowledge',
  greenhouse: 'kg of food, 2 days later',
  oxygen: 'kg of oxygen',
  solar: 'kWh of power',
};

/** What a job gives and costs, with the larger amount an expert gives. */
const deal = (job: Job): string => {
  if (job === 'rest') return 'Takes away tiredness.';
  const rule = JOB_RULES[job];
  const cost = rule.powerKwh > 0 ? ` Uses ${rule.powerKwh} kWh.` : ' Free.';
  return `+${rule.gives} ${UNITS[job]} (${rule.expertGives} for an expert).${cost}`;
};

/** Lists every job with what it does, gives and costs, so that no choice looks free. */
export const renderJobLegend = (list: HTMLElement) => {
  list.replaceChildren(
    ...JOB_ORDER.map((job) => {
      const item = element('li', 'base-jobs-help__item');
      item.append(
        element('strong', 'base-jobs-help__name', JOB_TEXTS[job].label),
        element('span', 'base-jobs-help__text', ` ${JOB_TEXTS[job].help} ${deal(job)}`),
      );
      return item;
    }),
  );
};
