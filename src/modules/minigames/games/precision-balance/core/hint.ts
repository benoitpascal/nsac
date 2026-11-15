import { isBalanced } from './torque';
import { HOOK_DISTANCES, SIDES, sameHook } from './types';
import type { Hook, Weight } from './types';

/** A move that leads towards a level arm: which free weight to hang on which hook. */
export type Hint = { weightId: number; mass: number; hook: Hook };

const allHooks = (): Hook[] =>
  SIDES.flatMap((side) => HOOK_DISTANCES.map((distance) => ({ side, distance })));

/** Every way to hang all the free weights on the hooks left by the locked ones that is level. */
const balancedLayouts = (weights: readonly Weight[]): Weight[][] => {
  const locked = weights.filter((weight) => weight.locked);
  const free = weights.filter((weight) => !weight.locked);
  const open = allHooks().filter((hook) => !locked.some((weight) => sameHook(weight.hook, hook)));
  const layouts: Weight[][] = [];
  const place = (index: number, placed: readonly Weight[]) => {
    const weight = free[index];
    if (weight === undefined) {
      if (isBalanced(placed)) layouts.push([...placed]);
      return;
    }
    open
      .filter((hook) => !placed.some((other) => sameHook(other.hook, hook)))
      .forEach((hook) => place(index + 1, [...placed, { ...weight, hook }]));
  };
  place(0, locked);
  return layouts;
};

/** Free weights of a layout that do not hang on the same hook yet in the current weights. */
const misplaced = (current: readonly Weight[], layout: readonly Weight[]) =>
  layout.filter((target) => {
    const now = current.find((weight) => weight.id === target.id);
    return !target.locked && !sameHook(now?.hook ?? null, target.hook);
  });

/**
 * Next helpful move: among the level layouts, takes the one closest to the current arm (most
 * free weights already in place) and returns one weight that is not yet where it should be,
 * preferring a weight still in the tray. Returns null when the level is solved or has no
 * solution.
 */
export const findHint = (weights: readonly Weight[]): Hint | null => {
  let best: { wrong: readonly Weight[] } | null = null;
  for (const layout of balancedLayouts(weights)) {
    const wrong = misplaced(weights, layout);
    if (best === null || wrong.length < best.wrong.length) best = { wrong };
  }
  if (best === null) return null;
  const inTray = (target: Weight) =>
    weights.some((weight) => weight.id === target.id && weight.hook === null);
  const target = best.wrong.find(inTray) ?? best.wrong[0];
  if (target?.hook == null) return null;
  return { weightId: target.id, mass: target.mass, hook: target.hook };
};
