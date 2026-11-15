import { isBalanced, sideTorque } from './torque';
import { HOOK_DISTANCES, MASSES, SIDES } from './types';
import type { Hook, Random, Weight } from './types';

type LevelPlan = { locked: number; movable: number };

const LEVEL_PLANS: readonly LevelPlan[] = [
  { locked: 1, movable: 2 },
  { locked: 2, movable: 3 },
  { locked: 2, movable: 4 },
];
/** Number of levels in a game. */
export const LEVEL_COUNT = LEVEL_PLANS.length;
const MAX_ATTEMPTS = 5000;

const FALLBACK_SOLUTION: readonly Weight[] = [
  { id: 0, mass: 2, locked: true, hook: { side: 'left', distance: 2 } },
  { id: 1, mass: 2, locked: false, hook: { side: 'right', distance: 1 } },
  { id: 2, mass: 1, locked: false, hook: { side: 'right', distance: 2 } },
];

const allHooks = (): Hook[] =>
  SIDES.flatMap((side) => HOOK_DISTANCES.map((distance) => ({ side, distance })));

const shuffle = <T>(items: readonly T[], random: Random) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
};

const pickMass = (random: Random) => MASSES[Math.floor(random() * MASSES.length)] ?? 1;

const lockedOnly = (weights: readonly Weight[]) => weights.filter((weight) => weight.locked);

const isPlayable = (solution: readonly Weight[]) =>
  isBalanced(solution) &&
  SIDES.every((side) => sideTorque(solution, side) > 0) &&
  !isBalanced(lockedOnly(solution));

const trySolution = (plan: LevelPlan, random: Random): Weight[] =>
  shuffle(allHooks(), random)
    .slice(0, plan.locked + plan.movable)
    .map((hook, id) => ({ id, mass: pickMass(random), locked: id < plan.locked, hook }));

const findSolution = (plan: LevelPlan, random: Random): readonly Weight[] => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const solution = trySolution(plan, random);
    if (isPlayable(solution)) return solution;
  }
  return FALLBACK_SOLUTION;
};

/**
 * Builds the starting weights of a level (0 = first): a balanced arm is built first, then the
 * free weights are taken off into the tray, so the level always has a solution.
 */
export const generateLevel = (levelIndex: number, random: Random): Weight[] => {
  const plan = LEVEL_PLANS[Math.min(levelIndex, LEVEL_COUNT - 1)] ?? { locked: 1, movable: 2 };
  return findSolution(plan, random).map((weight) =>
    weight.locked ? weight : { ...weight, hook: null },
  );
};
