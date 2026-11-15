import { nextExcavatorCue } from '../../core/excavator/excavator-cues';
import { EXCAVATOR_CUE_LINES } from '../../core/radio/base-radio-lines';
import type { ExcavatorCue } from '../../core/radio/base-radio-lines';
import type { createExcavatorDriving } from '../controls/excavator-driving';
import type { RadioMessage } from './radio-message';

/**
 * Has the base speak up on the radio during the robot mission: once enough regolith is dug, then
 * once it is all dropped off, to tell the player to leave the robot. Returns the per-frame check.
 */
export const createMissionRadio = (
  radio: RadioMessage,
  driving: ReturnType<typeof createExcavatorDriving>,
  goalKg: number,
) => {
  const said = new Set<ExcavatorCue>();
  return () => {
    const { carriedKg, deliveredKg } = driving.store();
    const unloading = driving.isUnloading();
    const cue = nextExcavatorCue(said, { carriedKg, deliveredKg, goalKg, unloading });
    if (!cue) return;
    said.add(cue);
    radio.say('📻 Radio · Base', EXCAVATOR_CUE_LINES[cue]);
  };
};
