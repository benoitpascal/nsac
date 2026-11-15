/** The base's three central resources, as percentages from 0 to 100. */
export type BaseStores = { air: number; power: number; water: number };

/** Starting levels of the act (game choice, see DATA.md). */
export const START_STORES: BaseStores = { air: 100, power: 85, water: 60 };

const FULL = 100;

const clamp = (value: number) => Math.round(Math.min(FULL, Math.max(0, value)) * 10) / 10;

/** Returns the stores after a use: positive values are spent, negative ones are gained. */
export const spend = (stores: BaseStores, used: BaseStores): BaseStores => ({
  air: clamp(stores.air - used.air),
  power: clamp(stores.power - used.power),
  water: clamp(stores.water - used.water),
});
