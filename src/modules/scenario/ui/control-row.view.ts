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

/** A door with an arrow walking out of it: leaving, not going on with the screen. */
const EXIT_ICON =
  '<svg class="control-row__leave-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 4H5v16h8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M10 12h11m-4-4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * Exit dashboard leaves the console: red and with a door icon, it looks unlike the buttons that go
 * on with the screen, so that it is not pressed by mistake.
 */
const exitButton = (leave: () => void) => {
  const exit = cutButton('Exit dashboard', 'wide', leave, 'control-row__leave');
  const chevrons = exit.querySelector('.cut-button__chevrons');
  if (chevrons) chevrons.outerHTML = EXIT_ICON;
  return exit;
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
        exitButton(() => leave?.()),
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
