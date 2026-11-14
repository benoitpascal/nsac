import { DIRECTIONS } from '../core/cell';
import { exitOf } from '../core/maze-game';
import type { Cell, Direction } from '../core/cell';
import type { MazePalette } from './palette';
import type { MazeState } from '../core/maze-game';

/** Wall thickness as a share of a cell. */
const WALL_SHARE = 0.12;
/** Icon size as a share of a cell. */
const ICON_SHARE = 0.72;
/** Hatch glow radius as a share of a cell. */
const HATCH_SHARE = 0.42;
/** Thinnest wall, in canvas pixels. */
const MIN_WALL_PX = 2;
const FULL_TURN = 2 * Math.PI;
const ASTRONAUT = '🧑‍🚀';
const HATCH = '🚪';

/** Corners of each side of a cell, as [from x, from y, to x, to y] in cell units. */
const SIDES: Record<Direction, readonly [number, number, number, number]> = {
  up: [0, 0, 1, 0],
  down: [0, 1, 1, 1],
  left: [0, 0, 0, 1],
  right: [1, 0, 1, 1],
};

const fitToScreen = (canvas: HTMLCanvasElement) => {
  const width = Math.round(canvas.clientWidth * devicePixelRatio);
  if (canvas.width !== width) [canvas.width, canvas.height] = [width, width];
};

const drawIcon = (context: CanvasRenderingContext2D, icon: string, cell: Cell, size: number) => {
  context.font = `${size * ICON_SHARE}px system-ui, sans-serif`;
  context.fillText(icon, (cell.col + 1 / 2) * size, (cell.row + 1 / 2) * size);
};

const drawWalls = (context: CanvasRenderingContext2D, maze: MazeState['maze'], size: number) => {
  context.beginPath();
  maze.openings.forEach((open, index) => {
    const [row, col] = [Math.floor(index / maze.size), index % maze.size];
    DIRECTIONS.filter((side) => !open.includes(side)).forEach((side) => {
      const [fromX, fromY, toX, toY] = SIDES[side];
      context.moveTo((col + fromX) * size, (row + fromY) * size);
      context.lineTo((col + toX) * size, (row + toY) * size);
    });
  });
  context.stroke();
};

/** Draws the maze walls, the exit hatch and the astronaut, sized to the canvas on screen. */
export const drawMaze = (canvas: HTMLCanvasElement, state: MazeState, palette: MazePalette) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  fitToScreen(canvas);
  const { maze } = state;
  const wall = Math.max(MIN_WALL_PX, (canvas.width / maze.size) * WALL_SHARE);
  const size = (canvas.width - wall) / maze.size;
  const exit = exitOf(maze);
  context.setTransform(1, 0, 0, 1, wall / 2, wall / 2);
  context.fillStyle = palette.floor;
  context.fillRect(-wall / 2, -wall / 2, canvas.width, canvas.height);
  context.fillStyle = palette.hatch;
  context.beginPath();
  context.arc(
    (exit.col + 1 / 2) * size,
    (exit.row + 1 / 2) * size,
    size * HATCH_SHARE,
    0,
    FULL_TURN,
  );
  context.fill();
  context.strokeStyle = palette.wall;
  context.lineWidth = wall;
  context.lineCap = 'round';
  drawWalls(context, maze, size);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  drawIcon(context, HATCH, exit, size);
  drawIcon(context, ASTRONAUT, state.astronaut, size);
};
