import { cutButton, el } from './dom';

export type ControlRowOptions = {
  /** Goes back one screen; without it, Back stays in its place, greyed out. */
  back?: () => void;
  /** Leaves the console; without it, Exit dashboard stays in its place, greyed out. */
  leave?: () => void;
  /** The screen's own buttons, on the right of Back (Next, Continue…). */
  actions?: readonly HTMLButtonElement[];
  /** The screen's main action, next to Exit dashboard at the bottom right (Launch mission). */
  primary?: HTMLButtonElement;
};

/** Names the sound the button plays when pressed (see the sound player's effects). */
const withSound = (button: HTMLButtonElement, sound: string) => {
  button.dataset.sound = sound;
  return button;
};

/** Creates a button in its place that cannot be used: shown greyed out, disabled. */
const placed = (button: HTMLButtonElement, enabled: boolean) => {
  button.disabled = !enabled;
  return button;
};

/**
 * Fills the control buttons under a terminal screen, as in Figma « Ecran - Dashboard »: on a first
 * line Back on the left and the screen's own buttons on the right, then at the bottom right Exit
 * dashboard and the main action. A button that cannot be used stays in its place, greyed out.
 */
export const fillControlRow = (row: HTMLElement, options: ControlRowOptions) => {
  const { back, leave, actions = [], primary } = options;
  const main = el('div', 'control-row__main');
  main.append(
    placed(
      withSound(
        cutButton('Back', 'text', () => back?.(), 'guide__back'),
        'back',
      ),
      back !== undefined,
    ),
    ...actions,
  );
  const exit = el('div', 'control-row__exit');
  exit.append(
    placed(
      withSound(
        cutButton('Exit dashboard', 'wide', () => leave?.()),
        'exit',
      ),
      leave !== undefined,
    ),
    ...(primary ? [primary] : []),
  );
  row.replaceChildren(main, exit);
  return row;
};

/** Creates the control buttons under a terminal screen (see fillControlRow). */
export const controlRow = (options: ControlRowOptions) =>
  fillControlRow(el('div', 'control-row'), options);
