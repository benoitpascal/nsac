/** What a panel reports to the game: a wrong move, or the panel fully solved. */
export type PanelEvents = { mistake: () => void; solved: () => void };

const SHAKE_MS = 400;
const SHAKE_PX = 8;

/** Shakes the panel sideways to show a mistake. */
export const shake = (panel: HTMLElement) => {
  panel.animate(
    [
      { transform: 'translateX(0)' },
      { transform: `translateX(-${SHAKE_PX}px)` },
      { transform: `translateX(${SHAKE_PX}px)` },
      { transform: `translateX(-${SHAKE_PX}px)` },
      { transform: 'translateX(0)' },
    ],
    { duration: SHAKE_MS },
  );
};

/** Creates an element with a class and optional text. */
export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text = '',
) => {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
};

/** Creates a big button with a spoken label for players using a screen reader. */
export const createButton = (className: string, text: string, label: string) => {
  const button = createElement('button', className, text);
  button.type = 'button';
  button.setAttribute('aria-label', label);
  return button;
};
