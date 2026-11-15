import { BASE } from '../core/base-state';
import { STORM_SOURCE } from '../core/demo-days';
import type { StormChoice } from '../core/base-state';

/** The two answers to the solar storm, each with what it costs. */
export const STORM_CHOICES: Record<StormChoice, { label: string; cost: string }> = {
  shelter: {
    label: 'Everyone into the shelter',
    cost: 'Its thick walls block much of the radiation. Nobody works outside it, and nobody rests well.',
  },
  work: {
    label: 'Keep working',
    cost: "Today's work gets done. But everyone gets a radiation dose: tomorrow the whole crew must rest.",
  },
};

/** Whether the lab may keep working in the storm, told with the regolith the robot brought. */
export const shieldText = (shielded: boolean, regolithKg: number): string =>
  shielded
    ? `Your ${Math.floor(regolithKg)} kg of regolith cover the lab walls. The lab can keep working.`
    : `The lab needs ${BASE.shieldRegolithKg} kg of regolith on its walls to stay open. ` +
      `The robot brought ${Math.floor(regolithKg)} kg on day one.`;

/** Where the storm comes from, told honestly: a real event, imagined here reaching the base. */
export const STORM_DATA_TEXT =
  `Real event: solar particles seen near Earth by ${STORM_SOURCE.spacecraft} on ${STORM_SOURCE.date}. ` +
  'Here we imagine them reaching your base.';
