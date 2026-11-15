import { describe, expect, it } from 'vitest';
import { moonAndEarthPhases } from '@/modules/planet-walk/core/sky/phases';
import { WORLD_CONDITIONS } from '@/modules/planet-walk/core/station/conditions';
import { localDayShare } from '@/modules/planet-walk/core/station/local-time';

const phasesOn = (date: number) => moonAndEarthPhases(localDayShare(WORLD_CONDITIONS.moon, date));

describe('Moon and Earth phases', () => {
  it('shows a full Earth at new Moon (new Moon of 13 October 2023, 18:55 UTC)', () => {
    expect(phasesOn(Date.UTC(2023, 9, 14, 18, 55))).toEqual({ moon: 'new', earth: 'full' });
  });

  it('shows a new Earth at full Moon (full Moon of 28 October 2023, 20:24 UTC)', () => {
    expect(phasesOn(Date.UTC(2023, 9, 28, 20, 24))).toEqual({ moon: 'full', earth: 'new' });
  });

  it('shows a waning Earth when the Moon waxes', () => {
    expect(phasesOn(Date.UTC(2023, 9, 18, 12))).toEqual({
      moon: 'waxing crescent',
      earth: 'waning gibbous',
    });
  });
});
