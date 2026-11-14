import { secretCodeGame } from './secret-code';
import { reflexesGame } from './reflexes';
import { mazeGame } from './maze';
import { liquidSortGame } from './liquid-sort';
import { defuseGame } from './defuse';
import { lightMemoryGame } from './light-memory';
import { powerGridGame } from './power-grid';
import { stopInTimeGame } from './stop-in-time';
import { directionFlashGame } from './direction-flash';
import { lightsOutGame } from './lights-out';
import { pipeFlowGame } from './pipe-flow';
import { hiddenObjectsGame } from './hidden-objects';
import { flashObservationGame } from './flash-observation';
import { precisionBalanceGame } from './precision-balance';
import { laserMirrorsGame } from './laser-mirrors';
import { quizGame } from './quiz';
import type { MiniGame } from '../core/minigame';

/** Every mini-game of the training menu, in menu order. */
export const MINI_GAMES: readonly MiniGame[] = [
  secretCodeGame,
  reflexesGame,
  mazeGame,
  liquidSortGame,
  defuseGame,
  lightMemoryGame,
  powerGridGame,
  stopInTimeGame,
  directionFlashGame,
  lightsOutGame,
  pipeFlowGame,
  hiddenObjectsGame,
  flashObservationGame,
  precisionBalanceGame,
  laserMirrorsGame,
  quizGame,
];
