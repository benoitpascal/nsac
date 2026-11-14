/** The four ways the Z Q S D keys steer the robot. */
export type Direction = 'forward' | 'back' | 'left' | 'right';

/** For each key's usual direction, the direction it now steers. */
export type ControlMap = Record<Direction, Direction>;

const DIRECTIONS: readonly Direction[] = ['forward', 'back', 'left', 'right'];

/** Each key steering its usual way. */
export const NORMAL_CONTROLS: ControlMap = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
};

const shuffle = (random: () => number) => {
  const shuffled = [...DIRECTIONS];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return Object.fromEntries(DIRECTIONS.map((key, index) => [key, shuffled[index]])) as ControlMap;
};

/** Returns a new random map in which no key keeps the direction it had in the previous one. */
export const scrambleControls = (previous: ControlMap, random: () => number): ControlMap => {
  for (;;) {
    const next = shuffle(random);
    if (DIRECTIONS.every((key) => next[key] !== previous[key])) return next;
  }
};

const pressed = (forward: number, turn: number): Direction[] => [
  ...(forward > 0 ? ['forward' as const] : forward < 0 ? ['back' as const] : []),
  ...(turn > 0 ? ['right' as const] : turn < 0 ? ['left' as const] : []),
];

/** Returns the steering (forward and turn, -1 to 1) that the pressed keys give under the map. */
export const steerWith = (controls: ControlMap, steering: { forward: number; turn: number }) => {
  const steered = pressed(steering.forward, steering.turn).map((direction) => controls[direction]);
  const count = (direction: Direction) => Number(steered.includes(direction));
  return { forward: count('forward') - count('back'), turn: count('right') - count('left') };
};
