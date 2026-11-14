/** A side of the cargo arm, seen from the player. */
export type Side = 'left' | 'right';

/** A hook of the arm: its side and its distance from the pivot (1 to 4). */
export type Hook = { side: Side; distance: number };

/** A weight (mass in kg); locked weights are fixed, the others sit on a hook or in the tray. */
export type Weight = { id: number; mass: number; locked: boolean; hook: Hook | null };

/** Returns a number in [0, 1), like Math.random. */
export type Random = () => number;

/** Both sides, left first. */
export const SIDES: readonly Side[] = ['left', 'right'];

/** Distances of the hooks from the pivot on each side. */
export const HOOK_DISTANCES: readonly number[] = [1, 2, 3, 4];

/** Masses a weight can have, in kg. */
export const MASSES: readonly number[] = [1, 2, 3];

/** Tells whether two hooks are the same place on the arm (an empty hook matches nothing). */
export const sameHook = (first: Hook | null, second: Hook | null) =>
  first !== null &&
  second !== null &&
  first.side === second.side &&
  first.distance === second.distance;
