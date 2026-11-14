/** A direction the co-pilot can call. */
export type Direction = 'up' | 'down' | 'left' | 'right';

/** Every direction, clockwise from up. */
export const DIRECTIONS: readonly Direction[] = ['up', 'right', 'down', 'left'];

const OPPOSITES: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/** Returns the direction pointing the other way. */
export const oppositeOf = (direction: Direction): Direction => OPPOSITES[direction];
