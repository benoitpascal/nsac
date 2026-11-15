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

/**
 * Creates a Figma cut-corner button (see cut-button.css) with its chevrons: `wide` is the framed
 * 361 px button, `primary` the same one filled in cyan with dark chevrons (the main action, as
 * Launch mission), `text` the frameless one with chevrons pointing back.
 */
export const cutButton = (
  label: string,
  variant: 'wide' | 'primary' | 'text',
  action: () => void,
  className = '',
) => {
  const element = button('', `cut-button cut-button--${variant} ${className}`.trim(), action);
  const chevrons = el('img', 'cut-button__chevrons');
  const dark = variant === 'primary' ? '-dark' : '';
  Object.assign(chevrons, { src: `/arcadia/act-select/chevrons-small${dark}.svg`, alt: '' });
  element.append(chevrons, label);
  return element;
};

/** Creates a button that runs the action when clicked. */
export const button = (label: string, className: string, action: () => void) => {
  const element = el('button', className, label);
  element.type = 'button';
  element.addEventListener('click', action);
  return element;
};
