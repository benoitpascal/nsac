/** What the base says on the radio when the astronaut wakes up in the crew quarters. */
export const WAKE_UP_LINES = [
  'Good morning, commander! Welcome to the Moon base.',
  'Take a walk around the base to see how it works.',
  'When you are ready, come to the station dashboard to start your mission.',
] as const;

/** Moments of the robot mission when the base speaks up. */
export type ExcavatorCue = 'enoughRegolith' | 'unloaded';

/** What the base says at each moment of the robot mission. */
export const EXCAVATOR_CUE_LINES: Record<ExcavatorCue, readonly string[]> = {
  enoughRegolith: [
    'That is enough regolith!',
    'Drive to the red zone and hold Space to unload it.',
  ],
  unloaded: [
    'Well done, the regolith is at the base!',
    'Now press E to leave the robot and save its battery.',
  ],
};

/** What the base says as the astronaut sets off to water the greenhouse. */
export const ERRAND_LINES = [
  'Suit on, commander!',
  'Go out through the airlock and walk to the glass dome. Follow the green light!',
] as const;

/** A message as it is read aloud. */
export const spoken = (lines: readonly string[]) => lines.join(' ');

/** Returns every message the base reads aloud, for the voice generation script. */
export const baseRadioVoiceLines = () =>
  [WAKE_UP_LINES, ERRAND_LINES, ...Object.values(EXCAVATOR_CUE_LINES)].map(spoken);
