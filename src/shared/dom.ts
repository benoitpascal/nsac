/**
 * Returns the first element matching the selector.
 * Throws when the page does not contain it.
 */
export const requireElement = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing ${selector} element`);
  return element;
};

/**
 * Returns the first element inside the parent matching the selector.
 * Throws when the parent does not contain it.
 */
export const requireChild = <T extends Element>(parent: ParentNode, selector: string): T => {
  const element = parent.querySelector<T>(selector);
  if (!element) throw new Error(`Missing ${selector} element`);
  return element;
};
