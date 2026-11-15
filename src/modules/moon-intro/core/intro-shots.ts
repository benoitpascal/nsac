/** One step of the cutscene: a video plays to its end, a still image stays on screen for a while. */
export type IntroShot =
  | { kind: 'video'; src: string; label: string }
  | { kind: 'still'; src: string; label: string; durationMs: number };

/** Landing on the Moon: touchdown, first step, a look at the Earth, the Earth, then the base. */
export const MOON_INTRO_SHOTS: readonly IntroShot[] = [
  {
    kind: 'video',
    src: '/game-design/alunissage.mp4',
    label: 'The lander touches down on the Moon',
  },
  { kind: 'video', src: '/game-design/walk-on-moon.mp4', label: 'A boot steps onto the Moon' },
  {
    kind: 'video',
    src: '/game-design/looking-toward-earth.mp4',
    label: 'The astronaut looks up at the Earth',
  },
  {
    kind: 'still',
    src: '/game-design/earth-from-moon.jpeg',
    label: 'The Earth seen from the Moon',
    durationMs: 4000,
  },
  {
    kind: 'video',
    src: '/game-design/looking-toward-base.mp4',
    label: 'The astronaut turns around and sees the base',
  },
];
