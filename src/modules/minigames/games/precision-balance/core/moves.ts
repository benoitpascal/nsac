import { sameHook } from './types';
import type { Hook, Weight } from './types';

/**
 * Moves a free weight onto a hook, or back to the tray with null. A free weight already on that
 * hook takes the moved weight's old place; locked weights never move and keep their hook.
 * Returns the very same list when the move changes nothing or is not allowed.
 */
export const moveWeight = (
  weights: readonly Weight[],
  id: number,
  hook: Hook | null,
): readonly Weight[] => {
  const moving = weights.find((weight) => weight.id === id);
  if (moving === undefined || moving.locked) return weights;
  if (hook === null ? moving.hook === null : sameHook(moving.hook, hook)) return weights;
  const occupant =
    hook === null ? undefined : weights.find((weight) => sameHook(weight.hook, hook));
  if (occupant?.locked) return weights;
  return weights.map((weight) => {
    if (weight.id === id) return { ...weight, hook };
    return weight === occupant ? { ...weight, hook: moving.hook } : weight;
  });
};
