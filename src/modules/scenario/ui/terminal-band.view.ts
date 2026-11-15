import { dayDate } from '../core/campaign';
import { actProgress, dayLabel } from '../core/progress';
import type { CampaignState } from '../core/campaign';
import type { Act } from '../core/scenario-content';
import { WORLD_CONDITIONS } from '@/modules/planet-walk/core/station/conditions';
import { isDaytime, localDayShare } from '@/modules/planet-walk/core/station/local-time';

export type TerminalBandElements = {
  day: HTMLElement;
  sun: HTMLElement;
  time: HTMLTimeElement;
  progress: HTMLElement;
  progressValue: HTMLElement;
};

const HOUR_MS = 3_600_000;
const TIME = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/**
 * The header of the base terminal (Figma « Ecran - Bandeau » and « Main Mission Progress »): the
 * game day, the Sun at the base, the base clock (same rule as the Moon walk: the day's date, plus
 * the hours lost in rescues, plus the time spent on the page) and the share of the act's missions
 * already played.
 */
export const createTerminalBand = (elements: TerminalBandElements, act: Act, now: () => number) => {
  const openedAt = now();
  let base = openedAt;
  const tick = () => {
    const at = base + now() - openedAt;
    elements.time.textContent = TIME.format(at);
    elements.time.dateTime = new Date(at).toISOString();
    const daytime = isDaytime(localDayShare(WORLD_CONDITIONS.moon, at));
    elements.sun.classList.toggle('band__sun--night', !daytime);
    elements.sun.setAttribute('aria-label', daytime ? 'Daytime' : 'Night');
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
