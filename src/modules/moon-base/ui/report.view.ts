import { GROW_DAYS } from '../core/jobs';
import { element } from './element';
import type { DayReport } from '../core/end-day';

const reportLines = (report: DayReport): string[] => [
  `The panels made ${report.solarKwh} kWh and the base used ${report.usedKwh} kWh.`,
  ...(report.wastedKwh > 0 ? [`The battery was full: ${report.wastedKwh} kWh were lost.`] : []),
  ...(report.oxygenMadeKg > 0 ? [`The machine made ${report.oxygenMadeKg} kg of oxygen.`] : []),
  ...(report.harvestedKg > 0 ? [`The greenhouse gave ${report.harvestedKg} kg of food.`] : []),
  ...(report.plantedKg > 0
    ? [`${report.plantedKg} kg of food will be ready on day ${report.day + GROW_DAYS}.`]
    : []),
  `The crew learned ${report.knowledge} knowledge points.`,
  ...(report.sentToRest.length > 0
    ? [`After the storm, the doctor sends ${report.sentToRest.join(', ')} to rest.`]
    : []),
];

/** Tells what the day did, in a dialog whose button starts the next day. */
export const showDayReport = (dialog: HTMLDialogElement, report: DayReport, onNext: () => void) => {
  const list = element('ul', 'base-report__lines');
  list.append(...reportLines(report).map((text) => element('li', 'base-report__line', text)));
  const next = element('button', 'pill-button base-report__next');
  next.type = 'button';
  next.append(element('span', 'pill-button__label', 'Next'));
  next.addEventListener('click', () => {
    dialog.close();
    onNext();
  });
  dialog.replaceChildren(
    element('h2', 'base-dialog__title', `End of day ${report.day}`),
    list,
    next,
  );
  dialog.addEventListener('cancel', (event) => event.preventDefault());
  dialog.showModal();
};
