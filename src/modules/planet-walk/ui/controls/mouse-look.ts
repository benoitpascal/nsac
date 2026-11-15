const RADIANS_PER_PIXEL = 0.0025;
const MAX_PITCH = 1.4;

/**
 * Turns the view only while the mouse button (or a finger) is held down on the canvas and moved:
 * sideways moves add up to a turn of the walker, up and down moves tilt the eyes. Moving the
 * mouse without pressing does nothing, and the keys keep working meanwhile.
 */
export const createMouseLook = (canvas: HTMLCanvasElement) => {
  let turn = 0;
  let pitch = 0;
  let dragging: number | undefined;
  canvas.addEventListener('pointerdown', (event) => {
    dragging = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
  });
  const release = (event: PointerEvent) => {
    if (event.pointerId === dragging) dragging = undefined;
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointermove', (event) => {
    if (event.pointerId !== dragging) return;
    turn += event.movementX * RADIANS_PER_PIXEL;
    pitch = Math.min(Math.max(pitch - event.movementY * RADIANS_PER_PIXEL, -MAX_PITCH), MAX_PITCH);
  });
  return {
    /** Returns the turn (radians, right positive) dragged since the last call. */
    takeTurn: () => {
      const taken = turn;
      turn = 0;
      return taken;
    },
    /** Eye tilt in radians, looking up as it grows. */
    pitch: () => pitch,
  };
};
