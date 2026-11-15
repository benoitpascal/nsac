import type { BaseStores } from './base-stores';

/** How well the 3D printer was calibrated. */
export type PrinterQuality = 'optimal' | 'partial' | 'failed';

/** What the base keeps besides its gauges: regolith waiting to be printed, and bricks made. */
export type Cargo = { regolithKg: number; bricks: number };

/** Printer rules (game values, see DATA.md). */
export const PRINTER = {
  /** Regolith in one brick (kg). */
  kgPerBrick: 10,
  /** Power points the printer uses for a day of printing. */
  powerPoints: 20,
  /** Share of the regolith turned into bricks, by calibration quality. */
  yield: { optimal: 1, partial: 0.6, failed: 0.3 } as Record<PrinterQuality, number>,
};

/** What a night costs the base: the crew breathes and drinks, the base draws power (points). */
export const NIGHT_COST: BaseStores = { air: 5, power: 5, water: 5 };

/** Returns the calibration quality of a mini-game score (0 to 100). */
export const qualityOf = (score: number): PrinterQuality =>
  score >= 70 ? 'optimal' : score >= 40 ? 'partial' : 'failed';

/** Returns the cargo once the printer has turned the regolith into bricks; the rest is wasted. */
export const printBricks = (cargo: Cargo, quality: PrinterQuality): Cargo => {
  const loads = Math.floor(cargo.regolithKg / PRINTER.kgPerBrick);
  return { regolithKg: 0, bricks: cargo.bricks + Math.floor(loads * PRINTER.yield[quality]) };
};
