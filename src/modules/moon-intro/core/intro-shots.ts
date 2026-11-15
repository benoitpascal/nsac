/** One step of the cutscene: a video plays to its end, a still image stays on screen for a while. */
export type IntroShot =
  | { kind: 'video'; src: string; label: string }
  | { kind: 'still'; src: string; label: string; durationMs: number };

/** Landing on the Moon: touchdown, the first steps, the Earth in the sky, then the base. */
export const MOON_INTRO_SHOTS: readonly IntroShot[] = [
  {
    kind: 'video',
    src: '/game-design/moon-landing.mp4',
    label: 'The lander touches down on the Moon, then the astronaut walks towards the base',
  },
];
