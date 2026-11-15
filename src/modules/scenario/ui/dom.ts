/** Creates an element with a class and an optional text. */
export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
) => {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

/** Creates a button that runs the action when clicked. */
export const button = (label: string, className: string, action: () => void) => {
  const element = el('button', className, label);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
};
