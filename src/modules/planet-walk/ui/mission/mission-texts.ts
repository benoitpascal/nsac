import { DAY_ONE } from '../../core/mission/day-one';
import type { MissionOutcome, ObjectiveId } from '../../core/mission/day-one';

/** What a goal says on screen, with a one-line help for a young player. */
export const OBJECTIVE_TEXTS: Record<ObjectiveId, { label: string; hint: string }> = {
  regolith: {
    label: `Bring ${DAY_ONE.regolithTargetKg} kg of regolith to the orange drop-off zone.`,
    hint: 'Regolith is the dust and broken rock that covers the Moon. Drive the robot from the station terminal.',
  },
  oxygen: {
    label: 'Check the oxygen level at the station terminal.',
    hint: 'Walk to the terminal in the middle of the base and press E.',
  },
};

/** A button at the end of the day: where it leads, or a fresh try of the same day. */
export type EndingAction = { label: string; href?: string };

/** What the end of the day tells the player, and where they can go next. */
export type EndingText = {
  title: string;
  text: (deliveredKg: number) => string;
  actions: EndingAction[];
};

export const ENDING_TEXTS: Record<Exclude<MissionOutcome, 'playing'>, EndingText> = {
  won: {
    title: 'Day 01 complete!',
    text: () =>
      `The base has its ${DAY_ONE.regolithTargetKg} kg of regolith. ` +
      "You checked the crew's oxygen too. Good planning, commander!",
    actions: [{ label: 'Run the base', href: '/base.html' }],
  },
  stranded: {
    title: 'The robot ran out of power',
    text: (deliveredKg) =>
      `Good work: it brought ${Math.floor(deliveredKg)} kg of regolith home. ` +
      `The base needed ${DAY_ONE.regolithTargetKg} kg. ` +
      'Driving, turning, digging and unloading all drain its small battery. ' +
      `Next time, dig ${DAY_ONE.regolithTargetKg} kg in one go. ` +
      'Then drive straight to the orange zone. ' +
      'You can also go on: with less regolith, the lab will be less safe in a solar storm.',
    actions: [{ label: 'Try again' }, { label: 'Run the base anyway', href: '/base.html' }],
  },
};
