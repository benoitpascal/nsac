import { DAY_ONE } from '../../core/mission/day-one';
import type { MissionOutcome, ObjectiveId } from '../../core/mission/day-one';

/** What a goal says on screen, with a one-line help for a young player. */
export const OBJECTIVE_TEXTS: Record<ObjectiveId, { label: string; hint: string }> = {
  collect: {
    label: `Dig ${DAY_ONE.goalUnits} units of regolith in the grey zone.`,
    hint: 'Regolith is the dust and broken rock that covers the Moon. Drive the robot from the station terminal.',
  },
  return: {
    label: 'Bring them back to the base, in the orange zone.',
    hint: 'Keep enough battery for the way back!',
  },
};

/** A button at the end of the mission: where it leads, or a fresh try. */
export type EndingAction = { label: string; href?: string };

/** What the end of the mission tells the player, and where they can go next. */
export type EndingText = {
  title: string;
  text: (deliveredKg: number) => string;
  actions: EndingAction[];
};

const unitsOf = (kg: number) => Math.floor(kg / DAY_ONE.kgPerUnit);

export const ENDING_TEXTS: Record<Exclude<MissionOutcome, 'playing'>, EndingText> = {
  won: {
    title: 'Regolith delivered!',
    text: () =>
      `The robot brought ${DAY_ONE.goalUnits} units of regolith home. ` +
      'The 3D printer can turn them into building materials.',
    actions: [{ label: 'Back to the terminal', href: '/terminal.html' }],
  },
  stranded: {
    title: 'The robot is stuck',
    text: (deliveredKg) =>
      `Its battery is empty. It brought ${unitsOf(deliveredKg)} units home before stopping. ` +
      'The crew will tow it back: that costs one more day. ' +
      'Next time, keep enough battery for the way back.',
    actions: [{ label: 'Try again' }, { label: 'Tow it back', href: '/terminal.html' }],
  },
};
