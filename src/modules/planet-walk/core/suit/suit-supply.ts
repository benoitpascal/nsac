/** What is left in the astronaut's suit: oxygen and battery, as percentages from 0 to 100. */
export type SuitSupply = { oxygen: number; battery: number };

/** How hard the astronaut works: resting, walking, running, or busy (driving, digging). */
export type SuitEffort = 'rest' | 'walk' | 'run' | 'action';

/** What the suit carries: oxygen bottles (each adds tank capacity) and extra items (each adds effort). */
export type SuitKit = { oxygenBottles: number; extraItems: number };

/** Suit rules (game values, see DATA.md). */
export const SUIT = {
  /** Oxygen used at rest with one bottle (% per second): a full bottle lasts about 6 minutes. */
  oxygenAtRest: 0.28,
  /** Battery used outside (% per second), for the lamp, radio and cooling. */
  batteryAtRest: 0.12,
  effort: { rest: 1, walk: 1.6, run: 2.6, action: 2 } as Record<SuitEffort, number>,
  /** Extra effort per carried item. */
  loadPerItem: 0.1,
  /** Refill speed inside the base (% per second). */
  refillPerSecond: 8,
  /** Level at which the crew brings the astronaut back. */
  rescueLevel: 9,
};

export const FULL_SUIT: SuitSupply = { oxygen: 100, battery: 100 };

const clamp = (value: number) => Math.min(100, Math.max(0, value));

/**
 * Returns the suit after the given time (s): outside, oxygen drains with effort and load and more
 * slowly with more bottles, the battery drains with effort; inside the base, both refill.
 */
export const stepSuit = (
  supply: SuitSupply,
  effort: SuitEffort,
  outside: boolean,
  kit: SuitKit,
  seconds: number,
): SuitSupply => {
  if (!outside)
    return {
      oxygen: clamp(supply.oxygen + SUIT.refillPerSecond * seconds),
      battery: clamp(supply.battery + SUIT.refillPerSecond * seconds),
    };
  const work = SUIT.effort[effort] * (1 + SUIT.loadPerItem * kit.extraItems);
  const bottles = Math.max(1, kit.oxygenBottles);
  return {
    oxygen: clamp(supply.oxygen - (SUIT.oxygenAtRest * work * seconds) / bottles),
    battery: clamp(supply.battery - SUIT.batteryAtRest * SUIT.effort[effort] * seconds),
  };
};

/** Whether the crew must bring the astronaut back: oxygen or battery at the rescue level. */
export const needsRescue = (supply: SuitSupply): boolean =>
  supply.oxygen <= SUIT.rescueLevel || supply.battery <= SUIT.rescueLevel;
