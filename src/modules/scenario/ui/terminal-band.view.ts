import { dayDate } from '../core/campaign';
import { actProgress, dayLabel } from '../core/progress';
import type { CampaignState } from '../core/campaign';
import type { Act } from '../core/scenario-content';

export type TerminalBandElements = {
  day: HTMLElement;
  time: HTMLTimeElement;
  progress: HTMLElement;
  progressValue: HTMLElement;
};

const HOUR_MS = 3_600_000;
const TIME = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/**
 * The header of the base terminal (Figma « Ecran - Bandeau » and « Main Mission Progress »): the
 * game day, the base clock (same rule as the Moon walk: the day's date, plus the hours lost in
 * rescues, plus the time spent on the page) and the share of the act's missions already played.
 */
export const createTerminalBand = (elements: TerminalBandElements, act: Act, now: () => number) => {
  const openedAt = now();
  let base = openedAt;
  const tick = () => {
    const at = base + now() - openedAt;
    elements.time.textContent = TIME.format(at);
    elements.time.dateTime = new Date(at).toISOString();
  };
  window.setInterval(tick, 10_000);
  return {
    update: (state: CampaignState) => {
      base = dayDate(state) + state.hoursLost * HOUR_MS;
      elements.day.textContent = dayLabel(state.dayIndex);
      const percent = Math.round(actProgress(act, state) * 100);
      elements.progress.style.setProperty('--progress', `${percent}%`);
      elements.progress.setAttribute('aria-valuenow', String(percent));
      elements.progressValue.textContent = `${percent}%`;
      tick();
    },
  };
};
