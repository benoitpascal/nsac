import type { Direction } from '../core/directions';

/**
 * Physical key positions: WASD on a QWERTY keyboard is ZQSD on an AZERTY one, so both layouts
 * answer with the same hand position. Arrow keys work too.
 */
const KEY_DIRECTIONS = new Map<string, Direction>([
  ['ArrowUp', 'up'],
  ['KeyW', 'up'],
  ['ArrowDown', 'down'],
  ['KeyS', 'down'],
  ['ArrowLeft', 'left'],
  ['KeyA', 'left'],
  ['ArrowRight', 'right'],
  ['KeyD', 'right'],
]);

/** Calls onDirection for each direction key pressed; returns how to stop listening. */
export const listenToDirectionKeys = (
  target: Window,
  onDirection: (direction: Direction) => void,
) => {
  const onKeyDown = (event: KeyboardEvent) => {
    const direction = KEY_DIRECTIONS.get(event.code);
    if (!direction) return;
    event.preventDefault();
    if (!event.repeat) onDirection(direction);
  };
  target.addEventListener('keydown', onKeyDown);
  return () => target.removeEventListener('keydown', onKeyDown);
};
