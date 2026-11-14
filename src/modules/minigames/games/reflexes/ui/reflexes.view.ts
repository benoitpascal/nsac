import { ROUND_COUNT } from '../core/reaction-round';
import { averageTime } from '../core/reaction-score';
import { roundSlotText, shownLabel } from './outcome-text';
import type { ReflexPhase, ReflexState } from '../core/reaction-round';

/** The launch board: what the player presses, and how to show the test's state on it. */
export type ReflexesView = { root: HTMLElement; render: (state: ReflexState) => void };

const FIXED_LABELS: Partial<Record<ReflexPhase, string>> = {
  ready: '👆 Tap to start',
  waiting: '✋ Wait…',
  go: '🚀 GO!',
};

const create = <K extends keyof HTMLElementTagNameMap>(tag: K, className: string) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const labelOf = (state: ReflexState) => {
  if (state.phase === 'over') return `⏱ ${Math.round(averageTime(state.outcomes) ?? 0)} ms`;
  if (state.phase === 'shown') return shownLabel(state.outcomes);
  return FIXED_LABELS[state.phase] ?? '';
};

/** Builds the signal light, its label and one slot per round inside the container. */
export const createReflexesView = (container: HTMLElement): ReflexesView => {
  const root = create('div', 'mg-reflexes');
  const tower = create('div', 'mg-reflexes-tower');
  const light = create('div', 'mg-reflexes-light');
  const label = create('p', 'mg-reflexes-label');
  const rounds = create('ol', 'mg-reflexes-rounds');
  const slots = Array.from({ length: ROUND_COUNT }, () => create('li', 'mg-reflexes-slot'));
  label.setAttribute('aria-live', 'polite');
  tower.append(light);
  rounds.append(...slots);
  root.append(tower, label, rounds);
  container.replaceChildren(root);
  const render = (state: ReflexState) => {
    root.dataset.phase = state.phase;
    label.textContent = labelOf(state);
    slots.forEach((slot, index) => {
      const outcome = state.outcomes.at(index);
      slot.textContent = roundSlotText(outcome);
      slot.classList.toggle('mg-reflexes-slot-miss', outcome?.kind === 'falseStart');
      slot.classList.toggle('mg-reflexes-slot-done', outcome?.kind === 'time');
    });
  };
  return { root, render };
};
