const SVG_NS = 'http://www.w3.org/2000/svg';

/** Creates an SVG element with the given attributes. */
export const createSvg = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attributes: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
  return element;
};
