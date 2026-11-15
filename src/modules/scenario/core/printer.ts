import type { BaseStores } from './base-stores';
import type { Quality } from './quality';

/** What the base keeps besides its gauges: regolith waiting to be printed, and bricks made. */
export type Cargo = { regolithKg: number; bricks: number };

/** Printer rules (game values, see DATA.md). */
export const PRINTER = {
  /** Regolith in one brick (kg). */
  kgPerBrick: 10,
  /** Power points the printer uses for a night of printing. */
  powerPoints: 20,
  /** Share of the regolith turned into bricks, by calibration quality. */
  yield: { optimal: 1, partial: 0.6, failed: 0.3 } as Record<Quality, number>,
};

/** What a night costs the base: the crew breathes, drinks and eats, the base draws power (points). */
export const NIGHT_COST: BaseStores = { air: 5, power: 5, water: 5, food: 5 };

/** Returns the bricks the printer makes from the regolith in store. */
export const bricksFrom = (cargo: Cargo, quality: Quality) =>
  Math.floor(Math.floor(cargo.regolithKg / PRINTER.kgPerBrick) * PRINTER.yield[quality]);

/** Returns the cargo once the printer has turned the regolith into bricks; the rest is wasted. */
export const printBricks = (cargo: Cargo, quality: Quality): Cargo => ({
  regolithKg: 0,
  bricks: cargo.bricks + bricksFrom(cargo, quality),
});
