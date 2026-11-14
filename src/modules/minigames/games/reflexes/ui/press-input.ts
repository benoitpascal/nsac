const PRESS_KEYS = new Set(['Space', 'Enter', 'NumpadEnter']);

/**
 * Calls onPress on a pointer press on the target, or on Space or Enter anywhere in the window.
 * Returns how to remove these listeners.
 */
export const listenToPresses = (target: HTMLElement, onPress: () => void) => {
  const onKey = (event: KeyboardEvent) => {
    if (!PRESS_KEYS.has(event.code)) return;
    event.preventDefault();
    if (!event.repeat) onPress();
  };
  const onPointer = (event: PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    onPress();
  };
  target.addEventListener('pointerdown', onPointer);
  window.addEventListener('keydown', onKey);
  return () => {
    target.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('keydown', onKey);
  };
};
