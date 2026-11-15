import type { Board } from '../core/board';

const SVG_NS = 'http://www.w3.org/2000/svg';
/** Middle of a square, in grid units. */
const HALF_SQUARE = 0.5;

/** An SVG layer the size of the grid, one grid unit per square, where cables are drawn. */
export const createCableLayer = (size: number) => {
  const layer = document.createElementNS(SVG_NS, 'svg');
  layer.setAttribute('class', 'mg-power-grid-cables');
  layer.setAttribute('viewBox', `0 0 ${size} ${size}`);
  layer.setAttribute('aria-hidden', 'true');
  return layer;
};

/** Draws each cable as a thick coloured line through the middle of its squares. */
export const drawCables = (layer: SVGSVGElement, board: Board) => {
  const lines = board.cables
    .map((cable, colour) => ({ cable, colour }))
    .filter(({ cable }) => cable.length > 1)
    .map(({ cable, colour }) => {
      const line = document.createElementNS(SVG_NS, 'polyline');
      const points = cable.map((s) => `${s.col + HALF_SQUARE},${s.row + HALF_SQUARE}`);
      line.setAttribute('points', points.join(' '));
      line.setAttribute('class', `mg-power-grid-cable mg-power-grid-c${colour}`);
      return line;
    });
  layer.replaceChildren(...lines);
};
