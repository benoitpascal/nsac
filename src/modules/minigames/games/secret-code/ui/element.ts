/** Creates an element with the given class names. */
export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  ...classNames: string[]
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  element.classList.add(...classNames);
  return element;
};
