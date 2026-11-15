export type WalkClockElements = { time: HTMLElement; sun: HTMLElement };

const TIME = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/** The clock of the HUD's top bar: the base time and a Sun shown while it is daytime. */
export const createWalkClock = (elements: WalkClockElements, now: () => number) => ({
  update: (daytime: boolean) => {
    const time = TIME.format(now());
    if (elements.time.textContent !== time) elements.time.textContent = time;
    elements.sun.classList.toggle('walk-topbar__sun--night', !daytime);
    elements.sun.setAttribute('aria-label', daytime ? 'Daytime' : 'Night');
  },
});
