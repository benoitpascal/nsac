import { pickOne, shuffle } from './random';
import type { Random } from './random';

/** One way to show the picture: turned by quarter turns (0 to 3), maybe mirrored. */
export type SymbolPose = { quarterTurns: number; mirrored: boolean };

/** The picture, the pose to find, and the six poses to choose from (one equals the target). */
export type SymbolPanel = { picture: string; target: SymbolPose; choices: SymbolPose[] };

const PICTURES = ['🚀', '🌙', '☄️', '🔭', '🛰️'] as const;
const QUARTER_TURNS = [0, 1, 2, 3];
const CHOICE_COUNT = 6;

const ALL_POSES: readonly SymbolPose[] = [false, true].flatMap((mirrored) =>
  QUARTER_TURNS.map((quarterTurns) => ({ quarterTurns, mirrored })),
);

/** Tells whether two poses look the same. */
export const isSamePose = (first: SymbolPose, second: SymbolPose) =>
  first.quarterTurns === second.quarterTurns && first.mirrored === second.mirrored;

/** Builds a panel: one picture, a pose to find, and six different poses including it. */
export const createSymbols = (random: Random): SymbolPanel => {
  const target = pickOne(random, ALL_POSES);
  const decoys = shuffle(
    random,
    ALL_POSES.filter((pose) => !isSamePose(pose, target)),
  ).slice(0, CHOICE_COUNT - 1);
  return {
    picture: pickOne(random, PICTURES),
    target,
    choices: shuffle(random, [target, ...decoys]),
  };
};
