import type { SymbolId } from '../core/rules';

type Shape = { kind: 'circle'; radius: number } | { kind: 'polygon'; points: string };

const SVG_NS = 'http://www.w3.org/2000/svg';
const VIEW_BOX = '-10 -10 20 20';

/** One shape per symbol; each symbol also has its own color, set in the stylesheet. */
const SHAPES: readonly Shape[] = [
  { kind: 'circle', radius: 8 },
  { kind: 'polygon', points: '-7,-7 7,-7 7,7 -7,7' },
  { kind: 'polygon', points: '0,-8.5 8.5,7 -8.5,7' },
  { kind: 'polygon', points: '0,-9 9,0 0,9 -9,0' },
  {
    kind: 'polygon',
    points: '0,-9 2.6,-3.2 8.6,-2.8 4,1.2 5.3,7.3 0,4 -5.3,7.3 -4,1.2 -8.6,-2.8 -2.6,-3.2',
  },
  { kind: 'polygon', points: '8.5,0 4.25,7.4 -4.25,7.4 -8.5,0 -4.25,-7.4 4.25,-7.4' },
];

/** Names of the symbols, read by screen readers. */
export const SYMBOL_NAMES = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'];

const createShape = (shape: Shape) => {
  if (shape.kind === 'circle') {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('r', String(shape.radius));
    return circle;
  }
  const polygon = document.createElementNS(SVG_NS, 'polygon');
  polygon.setAttribute('points', shape.points);
  return polygon;
};

/** Draws a symbol as a colored shape. */
export const createSymbolIcon = (symbol: SymbolId): SVGSVGElement => {
  const icon = document.createElementNS(SVG_NS, 'svg');
  icon.setAttribute('viewBox', VIEW_BOX);
  icon.setAttribute('aria-hidden', 'true');
  icon.classList.add('mg-secret-code-icon', `mg-secret-code-icon--${symbol}`);
  const shape = SHAPES[symbol];
  if (shape) icon.append(createShape(shape));
  return icon;
};
