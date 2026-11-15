import { startPipeFlow } from './ui/pipe-flow.view';
import type { MiniGame } from '../../core/minigame';

/** Pipe Flow: turn the pipes so that water runs from the ice drill to the greenhouse tank. */
export const pipeFlowGame: MiniGame = {
  id: 'pipe-flow',
  title: 'Pipe Flow',
  summary: 'Turn the pipes so that water runs from the ice drill to the greenhouse tank.',
  howTo: [
    'Tap a pipe to turn it a quarter turn.',
    'Connect the pipes so the water flows from the left side to the tank on the right.',
    'Every extra turn lets a little water leak: think about the path before you turn.',
  ],
  start: (container, finish) => startPipeFlow(container, finish),
};
