import { startPipeFlow } from './ui/pipe-flow.view';
import type { MiniGame } from '../../core/minigame';

/** Pipe Flow: turn the pipes so that water runs from the ice drill to the greenhouse tank. */
export const pipeFlowGame: MiniGame = {
  id: 'pipe-flow',
  title: 'Pipe Flow',
  summary: 'Turn the pipes so that water runs from the ice drill to the greenhouse tank.',
  start: (container, finish) => startPipeFlow(container, finish),
};
