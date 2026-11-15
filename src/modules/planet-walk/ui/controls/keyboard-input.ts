export type KeyboardMoves = { forward: number; run: boolean; turn: number; jump: boolean };

/**
 * Physical key positions: the WASD keys of a QWERTY keyboard are ZQSD on an AZERTY keyboard,
 * so both layouts walk and turn with the same hand position. Arrow keys work too.
 */
const FORWARD = ['KeyW', 'ArrowUp'];
const BACK = ['KeyS', 'ArrowDown'];
const LEFT = ['KeyA', 'ArrowLeft'];
const RIGHT = ['KeyD', 'ArrowRight'];
const JUMP = ['Space'];
const RUN = ['ShiftLeft', 'ShiftRight'];
const HANDLED = new Set([...FORWARD, ...BACK, ...LEFT, ...RIGHT, ...JUMP, ...RUN]);

/** Keeps track of the walking, running and jumping keys held down, and reads them as moves. */
export const createKeyboardInput = (target: Window) => {
  const held = new Set<string>();
  const isHeld = (codes: string[]) => codes.some((code) => held.has(code));
  target.addEventListener('keydown', (event) => {
    if (!HANDLED.has(event.code)) return;
    event.preventDefault();
    held.add(event.code);
  });
  target.addEventListener('keyup', (event) => held.delete(event.code));
  target.addEventListener('blur', () => held.clear());
  return {
    read: (): KeyboardMoves => ({
      forward: Number(isHeld(FORWARD)) - Number(isHeld(BACK)),
      run: isHeld(RUN),
      turn: Number(isHeld(RIGHT)) - Number(isHeld(LEFT)),
      jump: isHeld(JUMP),
    }),
  };
};
