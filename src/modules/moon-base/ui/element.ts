/** Returns a new element with its class and, optionally, its text. */
export const element = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const created = document.createElement(tag);
  created.className = className;
  if (text !== undefined) created.textContent = text;
  return created;
};

/** Returns a bar that fills to the value's share of the maximum, hidden from screen readers. */
export const bar = (value: number, max: number, className = 'base-bar') => {
  const meter = element('span', className);
  meter.style.setProperty(
    '--level',
    `${Math.round((Math.max(0, Math.min(value, max)) / max) * 100)}%`,
  );
  meter.setAttribute('aria-hidden', 'true');
  return meter;
};
