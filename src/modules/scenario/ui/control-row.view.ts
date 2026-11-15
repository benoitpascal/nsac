import { cutButton, el } from './dom';

export type ControlRowOptions = {
  /** Goes back one screen; without it, Back stays in its place, greyed out. */
  back?: () => void;
  /** Leaves the console; without it, Leave stays in its place, greyed out. */
  leave?: () => void;
  /** The screen's own buttons, on the right (Next, Launch mission, Continue…). */
  actions?: readonly HTMLButtonElement[];
};

/** Creates a button in its place that cannot be used: shown greyed out, disabled. */
const placed = (button: HTMLButtonElement, enabled: boolean) => {
  button.disabled = !enabled;
  return button;
};

/**
 * Fills the row of control buttons under a terminal screen, always in the same places: Back first,
 * Leave second, then the screen's own buttons on the right.
 */
export const fillControlRow = (row: HTMLElement, options: ControlRowOptions) => {
  const { back, leave, actions = [] } = options;
  row.replaceChildren(
    placed(
      cutButton('Back', 'text', () => back?.(), 'guide__back'),
      back !== undefined,
    ),
    placed(
      cutButton('Leave', 'text', () => leave?.(), 'guide__leave'),
      leave !== undefined,
    ),
    ...actions,
  );
  return row;
};

/** Creates the row of control buttons under a terminal screen (see fillControlRow). */
export const controlRow = (options: ControlRowOptions) =>
  fillControlRow(el('div', 'guide__actions'), options);
