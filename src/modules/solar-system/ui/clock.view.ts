import {
  advanceClock,
  freezeClock,
  resumeClock,
  reverseClock,
  setClockSpeed,
  startClock,
} from '../core/simulation-clock';
import { mountSpeedPicker } from './speed-picker.view';
import { mountTimeControls } from './time-controls.view';
import type { SimulationClock } from '../core/simulation-clock';

export type ClockView = {
  current: () => SimulationClock;
  /** Moves the clock by the real elapsed time, shows it, and returns the simulated ms elapsed. */
  tick: (elapsedSeconds: number) => number;
  /** Freezes the clock on the given date (Unix timestamp in ms). */
  jumpTo: (timestamp: number) => void;
};

/**
 * Holds the simulated clock, starting today (frozen when the user prefers reduced motion),
 * driven by the time controls and the speed picker.
 */
export const mountClock = (
  timePanel: HTMLElement,
  speedPicker: HTMLElement,
  reducedMotion: boolean,
): ClockView => {
  const now = Date.now();
  let clock = reducedMotion ? freezeClock(startClock(now), now) : startClock(now);
  const timeControls = mountTimeControls(timePanel, {
    onShowNow: () => (clock = freezeClock(clock, Date.now())),
    onTogglePause: () =>
      (clock = clock.running ? freezeClock(clock, clock.timestamp) : resumeClock(clock)),
    onReverse: () => (clock = reverseClock(clock)),
    onPickDate: (timestamp) => (clock = freezeClock(clock, timestamp)),
  });
  mountSpeedPicker(speedPicker, clock.daysPerSecond, (daysPerSecond) => {
    clock = setClockSpeed(clock, daysPerSecond);
  });
  return {
    current: () => clock,
    jumpTo: (timestamp) => {
      clock = freezeClock(clock, timestamp);
    },
    tick: (elapsedSeconds) => {
      const previousTimestamp = clock.timestamp;
      clock = advanceClock(clock, elapsedSeconds);
      timeControls.showClock(clock);
      return clock.timestamp - previousTimestamp;
    },
  };
};
