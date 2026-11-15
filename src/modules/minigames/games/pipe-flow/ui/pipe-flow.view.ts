import { MAX_SCORE } from '../../../core/minigame';
import {
  LEVEL_SIZES,
  isLastLevel,
  nextLevel,
  scoreOf,
  startPipeGame,
  turnTileAt,
} from '../core/game';
import { renderBoard } from './board.view';
import '../pipe-flow.css';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { PipeGame } from '../core/game';
import type { Random } from '../core/grid';

/** Pause showing the full tank before the next level, in milliseconds. */
const NEXT_LEVEL_DELAY_MS = 1200;

const createHud = () => {
  const hud = document.createElement('div');
  hud.className = 'mg-pipe-flow-hud';
  const level = document.createElement('span');
  const moves = document.createElement('span');
  hud.append(level, moves);
  return { hud, level, moves };
};

/**
 * Plays Pipe Flow inside the container: three boards of growing size where each tap turns a
 * pipe, until water runs from the ice drill to the greenhouse tank on every board.
 */
export const startPipeFlow = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  random: Random = Math.random,
): StopGame => {
  const { hud, level: levelText, moves: movesText } = createHud();
  const stage = document.createElement('div');
  stage.className = 'mg-pipe-flow-stage';
  const root = document.createElement('div');
  root.className = 'mg-pipe-flow';
  root.append(hud, stage);
  container.replaceChildren(root);
  let game: PipeGame = startPipeGame(random);
  let timer: number | undefined;
  const showHud = () => {
    levelText.textContent = `Level ${game.levelNumber + 1}/${LEVEL_SIZES.length}`;
    movesText.textContent = `Moves: ${game.moves}`;
  };
  const afterSolved = () => {
    if (isLastLevel(game)) {
      finish({ won: true, score: Math.min(MAX_SCORE, scoreOf(game)) });
      return;
    }
    timer = window.setTimeout(() => {
      timer = undefined;
      game = nextLevel(game, random);
      showLevel();
    }, NEXT_LEVEL_DELAY_MS);
  };
  const showLevel = () => {
    const hadFocus = stage.contains(document.activeElement);
    const update = renderBoard(stage, game.level, (index) => {
      if (game.solved) return;
      game = turnTileAt(game, index);
      update(game.level, game.solved);
      showHud();
      if (game.solved) afterSolved();
    });
    update(game.level, false);
    showHud();
    if (hadFocus) stage.querySelector('button')?.focus();
  };
  showLevel();
  return () => window.clearTimeout(timer);
};
