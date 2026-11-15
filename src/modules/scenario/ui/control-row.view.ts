import { cutButton, el } from './dom';

export type ControlRowOptions = {
  /** Goes back one screen; without it, Back stays in its place, greyed out. */
  back?: () => void;
  /** Leaves the console; without it, Leave stays in its place, greyed out. */
  leave?: () => void;
  /** The screen's own buttons, before Leave on the right (Next, Launch mission, Continue…). */
  actions?: readonly HTMLButtonElement[];
};

/** The cross drawn in front of Leave, in the place of the chevrons. */
const CROSS =
  '<svg class="cut-button__chevrons control-row__cross" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

/** Creates Leave, with its cross. */
const leaveButton = (leave: () => void) => {
  const button = cutButton('Leave', 'text', leave, 'guide__leave');
  button.querySelector('.cut-button__chevrons')?.remove();
  button.insertAdjacentHTML('afterbegin', CROSS);
  return button;
};

/** Creates a button in its place that cannot be used: shown greyed out, disabled. */
const placed = (button: HTMLButtonElement, enabled: boolean) => {
  button.disabled = !enabled;
  return button;
};

/**
 * Fills the row of control buttons under a terminal screen, always in the same places: Back on the
 * left, then on the right the screen's own buttons and Leave last.
 */
export const fillControlRow = (row: HTMLElement, options: ControlRowOptions) => {
  const { back, leave, actions = [] } = options;
  row.replaceChildren(
    placed(
      cutButton('Back', 'text', () => back?.(), 'guide__back'),
      back !== undefined,
    ),
    ...actions,
    placed(
      leaveButton(() => leave?.()),
      leave !== undefined,
    ),
  );
  return row;
};

/** Creates the row of control buttons under a terminal screen (see fillControlRow). */
export const controlRow = (options: ControlRowOptions) =>
  fillControlRow(el('div', 'guide__actions'), options);
