import { activityAfter, availableAction, passDoor } from '../../core/station/station-actions';
import type { Activity, StationAction, StationSpots } from '../../core/station/station-actions';
import type { Walker } from '../../core/walker';

const ACTION_KEY = 'KeyE';
/** Opens the tablet: the station terminal, from anywhere in the base. */
const TABLET_KEY = 'KeyT';
const TERMINAL_PAGE = '/briefing.html?menu';
const PROMPTS = {
  openDashboard: 'Open the station dashboard',
  closeDashboard: 'Close the dashboard',
  leaveExcavator: 'Leave the excavator',
};

const labelOf = (action: StationAction) =>
  action.kind === 'passDoor' ? action.passage.label : PROMPTS[action.kind];

/**
 * Lets the action key E (or the legend's button) open and close the station dashboard at its
 * terminal, hand the excavator robot back, and go through the closed doors; T opens the tablet
 * (the same terminal) from anywhere. Tells what the key
 * does right now, when it does something.
 */
export const createStationActions = (spots: StationSpots) => {
  let activity: Activity = 'walking';
  let available: StationAction | undefined;
  let pending: StationAction | undefined;
  let leftBase = false;
  const press = () => {
    pending = available;
  };
  window.addEventListener('keydown', (event) => {
    if (event.code === ACTION_KEY && !event.repeat) press();
    if (event.code === TABLET_KEY && !event.repeat) window.location.assign(TERMINAL_PAGE);
  });
  return {
    activity: () => activity,
    /** Presses the action key, from an on-screen button. */
    press,
    /** What the action key does right now, if anything. */
    label: () => (available ? labelOf(available) : undefined),
    /** Whether the astronaut went out through the airlock's outer door. */
    leftBase: () => leftBase,
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
      if (action?.kind === 'openDashboard') window.location.assign(TERMINAL_PAGE);
      else if (action) activity = activityAfter(action);
      const moved = action?.kind === 'passDoor' ? passDoor(walker, action.passage) : walker;
      if (action?.kind === 'passDoor' && action.passage.leavesBase) leftBase = true;
      available = availableAction(activity, moved, spots);
      return moved;
    },
  };
};
