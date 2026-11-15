import type { MapPoint } from '../../core/hud/minimap';

/** Colors of the HUD map, after the Figma mock-up. */
export const MAP_COLORS = {
  ground: 'rgba(16, 70, 82, 0.55)',
  building: 'rgba(53, 233, 253, 0.28)',
  edge: 'rgba(53, 233, 253, 0.75)',
  dig: 'rgba(249, 205, 95, 0.25)',
  drop: 'rgba(237, 95, 121, 0.3)',
  diamond: '#f9cd5f',
  cyan: '#35e9fd',
  ink: '#0b0f1c',
  pink: '#ed5f79',
};

const COLORS = MAP_COLORS;

export const trace = (context: CanvasRenderingContext2D, points: MapPoint[]) => {
  context.beginPath();
  points.forEach((point, index) =>
    index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y),
  );
  context.closePath();
};

/** The yellow diamond of the mock-up, marking where to dig. */
export const diamond = (context: CanvasRenderingContext2D, { x, y }: MapPoint) => {
  trace(context, [
    { x, y: y - 10 },
    { x: x + 10, y },
    { x, y: y + 10 },
    { x: x - 10, y },
  ]);
  context.fillStyle = COLORS.diamond;
  context.fill();
  context.strokeStyle = COLORS.ink;
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = COLORS.ink;
  context.fillRect(x - 3, y - 3, 6, 6);
};

/** A small house, marking the base hall where the station terminal stands. */
export const house = (context: CanvasRenderingContext2D, { x, y }: MapPoint) => {
  context.fillStyle = COLORS.ink;
  context.fillRect(x - 11, y - 11, 22, 22);
  context.strokeStyle = COLORS.cyan;
  context.lineWidth = 1.5;
  context.strokeRect(x - 11, y - 11, 22, 22);
  trace(context, [
    { x: x - 7, y: y - 1 },
    { x, y: y - 7 },
    { x: x + 7, y: y - 1 },
    { x: x + 5, y: y - 1 },
    { x: x + 5, y: y + 6 },
    { x: x - 5, y: y + 6 },
    { x: x - 5, y: y - 1 },
  ]);
  context.fillStyle = COLORS.cyan;
  context.fill();
};
