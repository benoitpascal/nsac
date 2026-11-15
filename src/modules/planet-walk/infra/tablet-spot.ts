/** Where the astronaut stood when opening the tablet: x, z (m) and heading (radians). */
export type TabletSpot = { x: number; z: number; heading: number };

const KEY = 'arcadia.tabletSpot';

/** Remembers where the astronaut opened the tablet, or forgets it when given nothing. */
export const rememberTabletSpot = (spot?: TabletSpot) => {
  try {
    if (spot) sessionStorage.setItem(KEY, JSON.stringify(spot));
    else sessionStorage.removeItem(KEY);
  } catch {
    // The astronaut then comes back in front of the terminal.
  }
};

/** Returns where the tablet was opened, once: the spot is forgotten as it is read. */
export const takeTabletSpot = (): TabletSpot | undefined => {
  try {
    const saved = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    const spot: unknown = saved ? JSON.parse(saved) : undefined;
    if (
      typeof spot === 'object' &&
      spot !== null &&
      ['x', 'z', 'heading'].every((key) => typeof (spot as Record<string, unknown>)[key] === 'number')
    )
      return spot as TabletSpot;
  } catch {
    // A broken spot is ignored.
  }
  return undefined;
};
