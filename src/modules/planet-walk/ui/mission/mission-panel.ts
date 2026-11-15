import { OBJECTIVE_TEXTS } from './mission-texts';
import type { Objective } from '../../core/mission/day-one';
import { requireChild } from '@/shared/dom';

const objectiveElement = ({ id, done, progress }: Objective) => {
  const item = document.createElement('li');
  item.className = done ? 'mission-objective mission-objective--done' : 'mission-objective';
  const box = document.createElement('span');
  box.className = 'mission-objective__box';
  box.textContent = done ? '✓' : '';
  box.setAttribute('aria-hidden', 'true');
  const body = document.createElement('span');
  const label = document.createElement('span');
  label.textContent = OBJECTIVE_TEXTS[id].label + (done ? ' (done)' : '');
  const hint = document.createElement('small');
  hint.className = 'mission-objective__hint';
  hint.textContent = OBJECTIVE_TEXTS[id].hint;
  body.append(label, hint);
  if (progress) {
    const meter = document.createElement('meter');
    meter.className = 'mission-objective__meter';
    meter.min = 0;
    meter.max = progress.target;
    meter.value = progress.value;
    meter.setAttribute('aria-hidden', 'true');
    const count = document.createElement('span');
    count.className = 'mission-objective__count';
    count.textContent = `${Math.floor(progress.value)} / ${progress.target} units`;
    body.append(meter, count);
  }
  item.append(box, body);
  return item;
};

/** Shows the day's goals in the panel, redrawing it only when something on it changed. */
export const createMissionPanel = (panel: HTMLElement) => {
  const list = requireChild<HTMLElement>(panel, '.mission-panel__list');
  panel.hidden = false;
  let shown = '';
  return (objectives: Objective[]) => {
    const key = JSON.stringify(
      objectives.map(({ done, progress }) => [done, Math.floor(progress?.value ?? 0)]),
    );
    if (key === shown) return;
    shown = key;
    list.replaceChildren(...objectives.map(objectiveElement));
  };
};
