import { describe, expect, it } from 'vitest';
import { commandLegend } from '@/modules/planet-walk/core/hud/command-legend';

const keys = (input: Parameters<typeof commandLegend>[0]) =>
  commandLegend(input).map(({ key, title }) => `${key}:${title}`);

describe('command legend', () => {
  it('shows walking, jumping, the view and the tablet, plus the action key only when it does something', () => {
    expect(keys({ activity: 'walking' })).toEqual([
      'move:Walk',
      'space:Jump',
      'v:Change view',
      't:Open the tablet',
    ]);
    expect(keys({ activity: 'walking', action: 'Open the door' })).toEqual([
      'move:Walk',
      'space:Jump',
      'e:Open the door',
      'v:Change view',
      't:Open the tablet',
    ]);
  });

  it('offers digging in the dig zone and unloading at the drop-off, while driving', () => {
    const robot = { place: 'dig', carriedKg: 0, full: false } as const;
    expect(keys({ activity: 'driving', action: 'Leave the excavator', robot })).toEqual([
      'move:Drive the robot',
      'space:Dig',
      'e:Leave the excavator',
    ]);
    expect(keys({ activity: 'driving', robot: { ...robot, full: true } })).toEqual([
      'move:Drive the robot',
    ]);
    expect(
      keys({ activity: 'driving', robot: { place: 'drop', carriedKg: 12, full: false } }),
    ).toEqual(['move:Drive the robot', 'space:Unload']);
  });

  it('only offers to close the dashboard while it is read', () => {
    expect(keys({ activity: 'dashboard', action: 'Close the dashboard' })).toEqual([
      'e:Close the dashboard',
    ]);
  });
});
