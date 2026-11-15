import { ENDING_TEXTS } from './mission-texts';
import type { EndingAction } from './mission-texts';
import type { MissionOutcome } from '../../core/mission/day-one';
import { requireChild } from '@/shared/dom';

const actionElement = ({ label, href }: EndingAction) => {
  if (href) {
    const link = document.createElement('a');
    link.className = 'mission-end__action';
    link.href = href;
    link.textContent = label;
    return link;
  }
  const button = document.createElement('button');
  button.className = 'mission-end__action';
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => window.location.reload());
  return button;
};

/**
 * Shows the end of the day in a dialog that only its buttons close: what went right or wrong, and
 * where to go next.
 */
export const showMissionEnding = (
  dialog: HTMLDialogElement,
  outcome: Exclude<MissionOutcome, 'playing'>,
  deliveredKg: number,
) => {
  const ending = ENDING_TEXTS[outcome];
  dialog.dataset.outcome = outcome;
  requireChild<HTMLElement>(dialog, '.mission-end__title').textContent = ending.title;
  requireChild<HTMLElement>(dialog, '.mission-end__text').textContent = ending.text(deliveredKg);
  requireChild<HTMLElement>(dialog, '.mission-end__actions').replaceChildren(
    ...ending.actions.map(actionElement),
  );
  dialog.addEventListener('cancel', (event) => event.preventDefault());
  dialog.showModal();
};
