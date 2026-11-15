import type { Activity } from '../station/station-actions';

/** The key drawn in a command's box. */
export type CommandKey = 'move' | 'space' | 'e' | 'v' | 't';

/** One line of the command legend (Figma « Legend command »): the key, what it does, how. */
export type Command = { key: CommandKey; title: string; detail: string };

/** Where the excavator robot is and what it carries, to tell whether it can dig or unload. */
export type RobotState = { place: 'dig' | 'drop' | 'elsewhere'; carriedKg: number; full: boolean };

export type LegendInput = {
  activity: Activity;
  /** What the action key E does right now, when it does something. */
  action?: string;
  robot?: RobotState;
};

const MOVE_KEYS = 'Arrow keys or W A S D';

const robotWork = ({ place, carriedKg, full }: RobotState): Command[] => {
  if (place === 'dig' && !full)
    return [{ key: 'space', title: 'Dig', detail: 'Hold the space bar to fill the drums' }];
  if (place === 'drop' && carriedKg > 0)
    return [{ key: 'space', title: 'Unload', detail: 'Hold the space bar to empty the drums' }];
  return [];
};

/**
 * The commands that do something right now: walking (move, jump, the action key when it is
 * offered, the camera view), driving the robot (drive, dig or unload where it can, leave), or
 * reading the dashboard (close it).
 */
export const commandLegend = ({ activity, action, robot }: LegendInput): Command[] => {
  const act: Command[] = action ? [{ key: 'e', title: action, detail: 'Press E' }] : [];
  if (activity === 'dashboard') return act;
  if (activity === 'driving')
    return [
      { key: 'move', title: 'Drive the robot', detail: MOVE_KEYS },
      ...(robot ? robotWork(robot) : []),
      ...act,
    ];
  return [
    { key: 'move', title: 'Walk', detail: MOVE_KEYS },
    { key: 'space', title: 'Jump', detail: 'Space bar' },
    ...act,
    { key: 'v', title: 'Change view', detail: 'Press V' },
    { key: 't', title: 'Open the tablet', detail: 'Press T' },
  ];
};
