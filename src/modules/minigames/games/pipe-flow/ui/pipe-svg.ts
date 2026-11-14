import { BASE_OPENINGS } from '../core/tiles';
import type { Side, TileKind } from '../core/tiles';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** The drawing is a 100 by 100 square; pipes run from its center to the middle of a side. */
const CENTER = 50;
const EDGE_POINTS: Record<Side, string> = { 0: '50,0', 1: '100,50', 2: '50,100', 3: '0,50' };
const HUB_RADIUS = 13;
const ROCKS = [
  { x: 32, y: 36, r: 9 },
  { x: 64, y: 62, r: 13 },
  { x: 70, y: 28, r: 5 },
];

const svgElement = <K extends keyof SVGElementTagNameMap>(name: K, attributes: object) => {
  const element = document.createElementNS(SVG_NS, name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  return element;
};

const pipeParts = (kind: TileKind) => {
  const sides = BASE_OPENINGS[kind];
  const points = sides.map((side) => `${CENTER},${CENTER} ${EDGE_POINTS[side]}`);
  const pipes = points.map((line) =>
    svgElement('polyline', { points: line, class: 'mg-pipe-flow-pipe' }),
  );
  const hub = svgElement('circle', {
    cx: CENTER,
    cy: CENTER,
    r: HUB_RADIUS,
    class: 'mg-pipe-flow-hub',
  });
  return [...pipes, hub];
};

const rockParts = () =>
  ROCKS.map(({ x, y, r }) => svgElement('circle', { cx: x, cy: y, r, class: 'mg-pipe-flow-rock' }));

/** Draws a tile's pipe, unrotated, or a few rocks for an empty tile. */
export const createPipeSvg = (kind: TileKind): SVGSVGElement => {
  const svg = svgElement('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true' });
  svg.classList.add('mg-pipe-flow-drawing');
  svg.append(...(kind === 'empty' ? rockParts() : pipeParts(kind)));
  return svg;
};
