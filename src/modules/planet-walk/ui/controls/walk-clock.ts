export type WalkClockElements = { time: HTMLElement; sun: HTMLElement };

const DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const HOUR = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });
/** The base's date and time, as « 15 Nov 2026 · 16:00 ». */
const TIME = { format: (at: number) => `${DATE.format(at)} · ${HOUR.format(at)}` };

/** The clock of the HUD's top bar: the base date and time, and a Sun shown while it is daytime. */
export const createWalkClock = (elements: WalkClockElements, now: () => number) => ({
  update: (daytime: boolean) => {
    const time = TIME.format(now());
    if (elements.time.textContent !== time) elements.time.textContent = time;
    elements.sun.classList.toggle('walk-topbar__sun--night', !daytime);
    elements.sun.setAttribute('aria-label', daytime ? 'Daytime' : 'Night');
  },
});
