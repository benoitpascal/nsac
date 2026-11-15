import { describe, expect, it } from 'vitest';
import { spend } from '@/modules/scenario/core/base-stores';
import { loadoutProblem, robotEnergyKwh, secondsOutside } from '@/modules/scenario/core/loadout';

const FULL = { air: 100, power: 100, water: 100, food: 100 };

describe('packing the bag', () => {
  it('accepts a tool, two bottles and one battery', () => {
    const loadout = { tool: 'wideDrums' as const, oxygenBottles: 2, spareBatteries: 1 };
    expect(loadoutProblem(loadout, FULL)).toBeUndefined();
    expect([secondsOutside(loadout), robotEnergyKwh(loadout)]).toEqual([180, 0.06]);
  });

  it('refuses a full bag', () => {
    expect(
      loadoutProblem({ tool: 'standardDrums', oxygenBottles: 2, spareBatteries: 2 }, FULL),
    ).toBe('Your bag is full.');
  });

  it('refuses going out without air', () => {
    expect(
      loadoutProblem({ tool: 'standardDrums', oxygenBottles: 0, spareBatteries: 0 }, FULL),
    ).toBe('Take at least one oxygen bottle.');
  });

  it('refuses bottles the base cannot fill', () => {
    const low = { air: 5, power: 100, water: 100, food: 100 };
    expect(
      loadoutProblem({ tool: 'standardDrums', oxygenBottles: 2, spareBatteries: 0 }, low),
    ).toBe('The base is too low on air to fill that many bottles.');
  });
});

describe('base stores', () => {
  it('never go below 0 or above 100', () => {
    expect(
      spend({ air: 2, power: 99, water: 50, food: 70 }, { air: 5, power: -5, water: 0 }),
    ).toEqual({ air: 0, power: 100, water: 50, food: 70 });
  });
});
