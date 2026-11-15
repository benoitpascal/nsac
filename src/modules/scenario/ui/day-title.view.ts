import { dayDate, startNextDay } from '../core/campaign';
import type { CampaignState } from '../core/campaign';
import type { Act } from '../core/scenario-content';
import { WORLD_CONDITIONS } from '@/modules/planet-walk/core/station/conditions';
import {
  isDaytime,
  localDayShare,
  outsideCelsius,
} from '@/modules/planet-walk/core/station/local-time';
import { STATION } from '@/modules/planet-walk/core/station/resources';

export type DayTitleElements = {
  title: HTMLElement;
  temperature: HTMLElement;
  sun: HTMLElement;
  crew: HTMLElement;
  date: HTMLElement;
  next: HTMLAnchorElement;
  alert: HTMLElement;
};

/** Sounds a short alarm: two alternating tones, quiet enough not to startle. */
const soundAlarm = () => {
  try {
    const audio = new AudioContext();
    const tone = audio.createOscillator();
    const volume = audio.createGain();
    volume.gain.value = 0.08;
    tone.type = 'square';
    for (let beep = 0; beep < 6; beep += 1)
      tone.frequency.setValueAtTime(beep % 2 ? 660 : 880, audio.currentTime + beep * 0.35);
    tone.connect(volume).connect(audio.destination);
    tone.start();
    tone.stop(audio.currentTime + 2.1);
  } catch {
    // No sound available: the alert still shows.
  }
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const MOON = WORLD_CONDITIONS.moon;

/**
 * Shows the title of the day being started (the next one at the end of a day) with the base's
 * conditions on that date: day one is the date the game started, day N is N − 1 days later.
 * Continue starts the next day, then opens the station dashboard.
 */
export const showDayTitle = (
  elements: DayTitleElements,
  state: CampaignState,
  act: Act,
  save: (state: CampaignState) => void,
) => {
  const ending = state.stage === 'dayEnd';
  const index = ending ? state.dayIndex + 1 : state.dayIndex;
  const date = dayDate(state, index);
  const share = localDayShare(MOON, date);
  const [first, ...rest] = (act.days[index]?.title ?? `Day ${index + 1}`).split(' ');
  elements.title.replaceChildren(
    Object.assign(document.createElement('span'), { textContent: first }),
    document.createTextNode(' '),
    Object.assign(document.createElement('span'), { textContent: rest.join(' ') }),
  );
  elements.temperature.textContent = `${Math.round(outsideCelsius(MOON, share))} °C`;
  elements.sun.textContent = isDaytime(share) ? 'daylight' : 'night';
  elements.crew.textContent = `${STATION.crew} / ${STATION.crew}`;
  elements.date.textContent = dateFormat.format(date);
  const next = ending ? startNextDay(state, act) : state;
  elements.next.addEventListener('click', (event) => {
    if (ending) save(next);
    if (!act.days[index]?.alert) return;
    event.preventDefault();
    soundAlarm();
    elements.alert.dataset.shelter = next.shelterQuality ?? 'none';
    elements.alert.hidden = false;
  });
};
