import { startMaze } from './ui/maze.view';
import type { MiniGame } from '../../core/minigame';

/** Maze: guide the astronaut through the space station to the exit hatch. */
export const mazeGame: MiniGame = {
  id: 'maze',
  title: 'Maze',
  summary: 'Guide the astronaut through the space station to the exit hatch.',
  howTo: [
    'Move the astronaut with the arrow keys or W A S D.',
    'Reach the exit hatch in the opposite corner before time runs out.',
    'Each level is a bigger maze.',
  ],
  start: startMaze,
};
