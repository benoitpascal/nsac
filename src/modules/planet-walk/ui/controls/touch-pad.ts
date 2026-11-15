const RELEASE_EVENTS = ['pointerup', 'pointercancel', 'lostpointercapture'] as const;

/**
 * Makes the on-screen buttons act as the keys named in their `data-key` attribute: held down while
 * a finger presses them and released when it lifts, so that phones and tablets play like keyboards.
 */
export const createTouchPad = (pad: HTMLElement, target: Window) => {
  for (const button of pad.querySelectorAll<HTMLButtonElement>('[data-key]')) {
    const code = button.dataset.key ?? '';
    let held = false;
    const send = (type: 'keydown' | 'keyup') =>
      target.dispatchEvent(new KeyboardEvent(type, { code }));
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      held = true;
      send('keydown');
    });
    for (const type of RELEASE_EVENTS)
      button.addEventListener(type, () => {
        if (!held) return;
        held = false;
        send('keyup');
      });
    button.addEventListener('contextmenu', (event) => event.preventDefault());
  }
};
