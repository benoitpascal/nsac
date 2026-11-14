import type { Direction } from '../core/cell';

/**
 * Physical key positions: WASD on a QWERTY keyboard is ZQSD on an AZERTY one, so both
 * layouts move the same way. Arrow keys work too.
 */
const KEY_DIRECTIONS: Partial<Record<string, Direction>> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};
const SCROLL_KEYS = new Set(['Space']);

/**
 * Calls onMove for every press of a moving key, without letting those keys (nor Space)
 * scroll the page. Returns how to stop listening.
 */
export const listenToMoveKeys = (target: Window, onMove: (direction: Direction) => void) => {
  const onKeyDown = (event: KeyboardEvent) => {
    const direction = KEY_DIRECTIONS[event.code];
    if (direction || SCROLL_KEYS.has(event.code)) event.preventDefault();
    if (direction) onMove(direction);
  };
  target.addEventListener('keydown', onKeyDown);
  return () => target.removeEventListener('keydown', onKeyDown);
};
