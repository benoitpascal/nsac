/** The base's vital resources, as percentages from 0 to 100. */
export type BaseStores = { air: number; power: number; water: number; food: number };

/** Starting levels of the act (validated scenario, see DATA.md). */
export const START_STORES: BaseStores = { air: 100, power: 85, water: 60, food: 70 };

const FULL = 100;

const clamp = (value: number) => Math.round(Math.min(FULL, Math.max(0, value)) * 10) / 10;

/** Returns the stores after a use: positive values are spent, negative ones are gained. */
export const spend = (stores: BaseStores, used: Partial<BaseStores>): BaseStores => ({
  air: clamp(stores.air - (used.air ?? 0)),
  power: clamp(stores.power - (used.power ?? 0)),
  water: clamp(stores.water - (used.water ?? 0)),
  food: clamp(stores.food - (used.food ?? 0)),
});
