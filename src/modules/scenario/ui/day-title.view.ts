import { dayDate, startNextDay } from '../core/campaign';
import { WAKE_UP_PAGE } from '../core/mission-route';
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
const NEXT_PAGE = '/briefing.html';
/** Time to read the title and the three cards once their entrance (about 2 s) is over. */
const HOLD_MS = 6500;

/**
 * Shows the title of the day being started (the next one at the end of a day) with the base's
 * conditions on that date: day one is the date the game started, day N is N − 1 days later.
 * Like the Figma prototype, the screen has no button: it moves on by itself after a few seconds,
 * or at once on a click, a tap or a key. Moving on starts the next day, then opens the station
 * dashboard (or raises the solar alert on the alert day).
 */
export const showDayTitle = (
  elements: DayTitleElements,
  state: CampaignState,
  act: Act,
  save: (state: CampaignState) => void,
  navigate: (url: string) => void,
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
  // The game starts by waking up in the crew quarters, then walking to the terminal.
  const nextPage = !ending && index === 0 && state.stage === 'briefing' ? WAKE_UP_PAGE : NEXT_PAGE;
  let done = false;
  const moveOn = () => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    removeEventListener('pointerdown', moveOn);
    removeEventListener('keydown', moveOn);
    if (ending) save(next);
    if (!act.days[index]?.alert) return navigate(nextPage);
    soundAlarm();
    elements.alert.dataset.shelter = next.shelterQuality ?? 'none';
    elements.alert.hidden = false;
  };
  const timer = window.setTimeout(moveOn, HOLD_MS);
  addEventListener('pointerdown', moveOn);
  addEventListener('keydown', moveOn);
};
