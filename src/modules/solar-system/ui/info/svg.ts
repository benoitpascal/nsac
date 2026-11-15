const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/** Creates an SVG element with the given attributes. */
export const svgElement = (tag: string, attributes: Record<string, string | number>) => {
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};

/** Creates a centered SVG text label. */
export const svgText = (text: string, x: number, y: number) => {
  const element = svgElement('text', {
    x,
    y,
    'text-anchor': 'middle',
    class: 'info__drawing-label',
  });
  element.textContent = text;
  return element;
};

/** Creates an SVG drawing of the given size, described for screen readers. */
export const createSvg = (width: number, height: number, description: string) => {
  const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img' });
  svg.setAttribute('aria-label', description);
  return svg;
};
