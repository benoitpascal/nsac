import type { Beam } from '../core/beam';
import type { Board } from '../core/board';

/** The glowing laser drawn over the board. */
export type BeamLayer = { svg: SVGSVGElement; draw: (beam: Beam) => void };

const SVG_NS = 'http://www.w3.org/2000/svg';
const CELL_CENTER = 0.5;

const line = (className: string) => {
  const polyline = document.createElementNS(SVG_NS, 'polyline');
  polyline.setAttribute('class', className);
  return polyline;
};

/** Creates the SVG layer, in cell units, that draws the beam path from the emitter. */
export const createBeamLayer = (board: Board): BeamLayer => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'mg-laser-mirrors-beam');
  svg.setAttribute('viewBox', `0 0 ${board.width} ${board.height}`);
  svg.setAttribute('aria-hidden', 'true');
  const glow = line('mg-laser-mirrors-beam-glow');
  const core = line('mg-laser-mirrors-beam-core');
  svg.append(glow, core);
  const draw = (beam: Beam) => {
    const points = [...beam.cells, beam.end]
      .map(({ x, y }) => `${x + CELL_CENTER},${y + CELL_CENTER}`)
      .join(' ');
    glow.setAttribute('points', points);
    core.setAttribute('points', points);
  };
  return { svg, draw };
};
