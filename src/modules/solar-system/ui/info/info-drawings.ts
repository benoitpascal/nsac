import { createSvg, svgElement, svgText } from './svg';

export type DrawnBody = {
  name: string;
  /** Radius for a size comparison, distance from the Sun for a distance strip. */
  value: number;
  color: string;
};

const WIDTH = 240;
const SIZE_HEIGHT = 110;
const MAX_CIRCLE_RADIUS = 40;
const MIN_CIRCLE_RADIUS = 1.5;
const LABEL_Y_OFFSET = 14;
const STRIP_HEIGHT = 56;
const STRIP_MARGIN = 14;
const STRIP_Y = 22;
const STRIP_EXTRA = 1.1;
const SUN_COLOR = '#ffb347';

/** Draws two bodies side by side as circles at their true relative size. */
export const drawSizeComparison = (first: DrawnBody, second: DrawnBody): SVGElement => {
  const svg = createSvg(
    WIDTH,
    SIZE_HEIGHT,
    `${first.name} and ${second.name} at true relative size`,
  );
  const unit = MAX_CIRCLE_RADIUS / Math.max(first.value, second.value);
  const baseline = SIZE_HEIGHT - LABEL_Y_OFFSET - 4;
  [first, second].forEach((body, index) => {
    const radius = Math.max(body.value * unit, MIN_CIRCLE_RADIUS);
    const x = (WIDTH / 4) * (1 + 2 * index);
    svg.append(
      svgElement('circle', { cx: x, cy: baseline - radius, r: radius, fill: body.color }),
      svgText(body.name, x, SIZE_HEIGHT - 4),
    );
  });
  return svg;
};

/** Draws the Sun and the given bodies on a line, at their true relative distances. */
export const drawDistanceStrip = (bodies: DrawnBody[]): SVGElement => {
  const names = bodies.map((body) => body.name).join(' and ');
  const svg = createSvg(WIDTH, STRIP_HEIGHT, `Distances of ${names} from the Sun, to scale`);
  const farthest = Math.max(...bodies.map((body) => body.value)) * STRIP_EXTRA;
  const xFor = (distance: number) =>
    STRIP_MARGIN + (distance / farthest) * (WIDTH - 2 * STRIP_MARGIN);
  svg.append(
    svgElement('line', {
      x1: xFor(0),
      y1: STRIP_Y,
      x2: xFor(farthest),
      y2: STRIP_Y,
      class: 'info__drawing-line',
    }),
    svgElement('circle', { cx: xFor(0), cy: STRIP_Y, r: 6, fill: SUN_COLOR }),
    svgText('Sun', xFor(0), STRIP_Y + 2 * LABEL_Y_OFFSET),
  );
  bodies.forEach((body, index) => {
    const x = xFor(body.value);
    const labelY = STRIP_Y + (index % 2 === 0 ? -LABEL_Y_OFFSET + 2 : 2 * LABEL_Y_OFFSET);
    svg.append(
      svgElement('circle', { cx: x, cy: STRIP_Y, r: 4, fill: body.color }),
      svgText(body.name, x, labelY),
    );
  });
  return svg;
};
