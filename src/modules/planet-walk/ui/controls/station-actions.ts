import { activityAfter, availableAction, passDoor } from '../../core/station/station-actions';
import type { Activity, StationAction, StationSpots } from '../../core/station/station-actions';
import type { Walker } from '../../core/walker';

const ACTION_KEY = 'KeyE';
const PROMPTS = {
  openDashboard: 'Open the station dashboard',
  closeDashboard: 'Close the dashboard',
  leaveExcavator: 'Leave the excavator',
};

const promptOf = (action: StationAction) =>
  `E · ${action.kind === 'passDoor' ? action.passage.label : PROMPTS[action.kind]}`;

/**
 * Lets the action key E (or the prompt button) open and close the station dashboard at its
 * terminal, hand the excavator robot back, and go through the closed doors. Shows the prompt only
 * when the key does something.
 */
export const createStationActions = (spots: StationSpots, prompt: HTMLButtonElement) => {
  let activity: Activity = 'walking';
  let available: StationAction | undefined;
  let pending: StationAction | undefined;
  const press = () => {
    pending = available;
  };
  window.addEventListener('keydown', (event) => {
    if (event.code === ACTION_KEY && !event.repeat) press();
  });
  prompt.addEventListener('click', () => {
    press();
    prompt.blur();
  });
  return {
    activity: () => activity,
    closeDashboard: () => {
      if (activity === 'dashboard') activity = 'walking';
    },
    /** Takes the keys back from the excavator robot, as when its battery runs out. */
    stopDriving: () => {
      if (activity === 'driving') activity = 'walking';
    },
    /** Hands the keys over to the excavator robot, when a mission starts. */
    takeExcavator: () => {
      activity = 'driving';
    },
    /** Hands the keys over to the excavator robot, from the dashboard. */
    driveExcavator: () => {
      if (activity === 'dashboard') activity = 'driving';
    },
    /** Applies the pressed action, carrying the walker through the door when asked. */
    update: (walker: Walker): Walker => {
      const action = pending;
      pending = undefined;
      if (action?.kind === 'openDashboard') window.location.assign('/briefing.html');
      else if (action) activity = activityAfter(action);
      const moved = action?.kind === 'passDoor' ? passDoor(walker, action.passage) : walker;
      available = availableAction(activity, moved, spots);
      prompt.hidden = !available;
      prompt.textContent = available ? promptOf(available) : '';
      return moved;
    },
  };
};
