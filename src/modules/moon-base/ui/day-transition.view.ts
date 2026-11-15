import type { Campaign } from '../core/campaign';
import { requireChild } from '@/shared/dom';

const NUMBER_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];

/** Days of sunlight the polar site still has on day 1 (simulation value, see DATA.md). */
const SUN_DAYS_AT_START = 14;

export type TransitionElements = {
  title: HTMLElement;
  solarValue: HTMLElement;
  solarLabel: HTMLElement;
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

/**
 * Shows the morning of the current day: its number, and the sunlight left. On a normal day the
 * button leads to the day's screen; on the alert day it raises the solar alert instead, which
 * fades to black and ends the demo.
 */
export const mountDayTransition = (
  elements: TransitionElements,
  campaign: Campaign | undefined,
) => {
  if (!campaign || campaign.stage === 'dayOne') return;
  const word = NUMBER_WORDS[campaign.day - 1] ?? String(campaign.day);
  requireChild<HTMLElement>(elements.title, 'span:last-child').textContent = word;
  elements.solarValue.textContent = `${Math.max(0, SUN_DAYS_AT_START - campaign.day + 1)} days`;
  elements.solarLabel.textContent = 'sunlight left';
  if (campaign.stage !== 'alert') {
    elements.next.href = '/base.html';
    return;
  }
  elements.next.addEventListener('click', (event) => {
    event.preventDefault();
    soundAlarm();
    elements.alert.dataset.shelter = campaign.shelter ?? 'none';
    elements.alert.hidden = false;
  });
};
