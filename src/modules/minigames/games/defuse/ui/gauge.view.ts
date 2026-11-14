import { createElement } from './panel';

const MS_PER_SECOND = 1000;
const PERCENT = 100;
/** Below this share of time left, the gauge turns hot. */
const HOT_SHARE = 0.3;

/** Creates the temperature gauge whose cool bar drains as the countdown runs. */
export const createGauge = () => {
  const gauge = createElement('div', 'mg-defuse-gauge');
  const track = createElement('div', 'mg-defuse-gauge-track');
  const fill = createElement('div', 'mg-defuse-gauge-fill');
  const seconds = createElement('span', 'mg-defuse-gauge-seconds');
  gauge.setAttribute('role', 'timer');
  track.append(fill);
  gauge.append(createElement('span', 'mg-defuse-gauge-icon', '🌡️'), track, seconds);
  const update = (share: number, timeLeftMs: number) => {
    fill.style.width = `${Math.max(0, share) * PERCENT}%`;
    gauge.classList.toggle('mg-defuse-gauge-hot', share < HOT_SHARE);
    seconds.textContent = `${Math.ceil(timeLeftMs / MS_PER_SECOND)}s`;
  };
  return { element: gauge, update };
};

const STEP_ICONS = ['✂️', '🔢', '🔍'];

/** Creates the row of panel icons; solved panels get a check mark. */
export const createSteps = () => {
  const row = createElement('div', 'mg-defuse-steps');
  const steps = STEP_ICONS.map((icon) => createElement('span', 'mg-defuse-step', icon));
  row.append(...steps);
  const update = (solved: number) => {
    steps.forEach((step, index) => {
      step.classList.toggle('mg-defuse-step-done', index < solved);
      step.classList.toggle('mg-defuse-step-now', index === solved);
    });
  };
  return { element: row, update };
};
