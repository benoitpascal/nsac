import { SIMULATION_RANGE } from '../core/simulation-clock';
import type { SimulationClock } from '../core/simulation-clock';

export type TimeControls = {
  showClock: (clock: SimulationClock) => void;
};

export type TimeActions = {
  onShowNow: () => void;
  onTogglePause: () => void;
  onReverse: () => void;
  onPickDate: (timestamp: number) => void;
};

const PAUSE_LABEL = 'Pause';
const PLAY_LABEL = 'Play';

const pad = (value: number) => String(value).padStart(2, '0');

/** Formats a timestamp as the local date and time a datetime-local field expects. */
const toFieldValue = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * Wires the date field (showing the simulated local date and time, and letting the user jump
 * to another date), the pause / play button, the now button and the rewind button.
 */
export const mountTimeControls = (panel: HTMLElement, actions: TimeActions): TimeControls => {
  const dateField = panel.querySelector<HTMLInputElement>('[data-simulated-date]');
  const pauseButton = panel.querySelector<HTMLButtonElement>('[data-time-pause]');
  const nowButton = panel.querySelector<HTMLButtonElement>('[data-time-now]');
  const rewindButton = panel.querySelector<HTMLButtonElement>('[data-time-rewind]');
  let running: boolean | undefined;

  if (dateField) {
    dateField.min = toFieldValue(SIMULATION_RANGE.start);
    dateField.max = toFieldValue(SIMULATION_RANGE.end);
    dateField.addEventListener('change', () => {
      const timestamp = new Date(dateField.value).getTime();
      if (Number.isFinite(timestamp)) actions.onPickDate(timestamp);
    });
  }
  pauseButton?.addEventListener('click', actions.onTogglePause);
  nowButton?.addEventListener('click', actions.onShowNow);
  rewindButton?.addEventListener('click', actions.onReverse);

  return {
    showClock: (clock) => {
      const value = toFieldValue(clock.timestamp);
      if (dateField && document.activeElement !== dateField && dateField.value !== value) {
        dateField.value = value;
      }
      rewindButton?.setAttribute('aria-pressed', String(clock.backwards));
      if (pauseButton && running !== clock.running) {
        running = clock.running;
        pauseButton.textContent = running ? PAUSE_LABEL : PLAY_LABEL;
      }
    },
  };
};
