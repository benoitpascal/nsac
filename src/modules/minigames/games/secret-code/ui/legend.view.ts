import { createElement } from './element';

const ENTRIES = [
  { kind: 'exact', text: 'Right place' },
  { kind: 'misplaced', text: 'Wrong place' },
] as const;

/** Explains the clue dots with a filled dot and a hollow dot. */
export const createLegend = (): HTMLElement => {
  const legend = createElement('div', 'mg-secret-code-legend');
  ENTRIES.forEach(({ kind, text }) => {
    const entry = createElement('span', 'mg-secret-code-legend-entry');
    const dot = createElement('span', 'mg-secret-code-dot', `mg-secret-code-dot--${kind}`);
    entry.append(dot, text);
    legend.append(entry);
  });
  return legend;
};
