import { startMaze } from './ui/maze.view';
import type { MiniGame } from '../../core/minigame';

/** Maze: guide the astronaut through the space station to the exit hatch. */
export const mazeGame: MiniGame = {
  id: 'maze',
  title: 'Maze',
  summary: 'Guide the astronaut through the space station to the exit hatch.',
  start: startMaze,
};
