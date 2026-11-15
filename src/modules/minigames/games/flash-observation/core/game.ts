import { MAX_SCORE } from '../../../core/minigame';
import { askQuestion } from './ask';
import { drawPicture } from './picture';
import { QUESTION_ASKS } from './question';
import { shuffle } from './random';
import type { MiniGameResult } from '../../../core/minigame';
import type { Picture, PictureLevel } from './picture';
import type { Question } from './question';
import type { Random } from './random';

/** One round: the picture to look at, then the question about it. */
export type Round = { picture: Picture; question: Question };

/** The rounds of a game and the option index picked for each round answered so far. */
export type Game = { rounds: Round[]; picks: number[] };

/** Each round's picture is a little busier than the one before. */
const LEVELS: readonly PictureLevel[] = [
  { items: 6, kinds: 4, colours: 3 },
  { items: 7, kinds: 4, colours: 3 },
  { items: 8, kinds: 4, colours: 3 },
  { items: 9, kinds: 5, colours: 4 },
  { items: 10, kinds: 5, colours: 4 },
  { items: 12, kinds: 5, colours: 4 },
];
/** Fewest right answers needed to win. */
export const WIN_CORRECT = 4;

/** Starts a game whose rounds ask each question kind equally often. */
export const startGame = (random: Random): Game => {
  const asks = shuffle(random, [...QUESTION_ASKS, ...QUESTION_ASKS]);
  const rounds = LEVELS.map((level, index) => {
    const picture = drawPicture(random, level);
    return { picture, question: askQuestion(random, picture, asks[index] ?? 'howMany') };
  });
  return { rounds, picks: [] };
};

/** The round waiting for an answer, or undefined once every round is answered. */
export const currentRound = (game: Game): Round | undefined => game.rounds[game.picks.length];

/** Records the option picked for the current round. */
export const answerRound = (game: Game, pick: number): Game => ({
  ...game,
  picks: [...game.picks, pick],
});

/** How many rounds were answered right. */
export const countCorrect = (game: Game) =>
  game.picks.filter((pick, index) => game.rounds[index]?.question.answer === pick).length;

/** The result: won with enough right answers, scored by the share of right answers. */
export const gameResult = (game: Game): MiniGameResult => {
  const correct = countCorrect(game);
  return { won: correct >= WIN_CORRECT, score: (correct / game.rounds.length) * MAX_SCORE };
};
