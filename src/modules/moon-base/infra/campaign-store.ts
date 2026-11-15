import type { BaseState } from '../core/base-state';

const KEYS = { regolith: 'horizon.dayOneRegolithKg', base: 'horizon.moonBase' };

/** The tab's session storage, or nothing when the browser blocks it. */
const storage = (): Storage | undefined => {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
};

const write = (key: string, value: string) => {
  try {
    storage()?.setItem(key, value);
  } catch {
    // Storage full or blocked: the demo still plays, it just forgets on reload.
  }
};

/** Keeps the regolith the robot brought on day one (kg), for the base to use. */
export const saveRegolith = (kg: number) => write(KEYS.regolith, String(kg));

/** Returns the regolith brought on day one (kg), 0 when the robot mission was not played. */
export const loadRegolith = (): number => Number(storage()?.getItem(KEYS.regolith)) || 0;

/** Keeps the base between page loads, so that a reload does not lose the days played. */
export const saveBase = (state: BaseState) => write(KEYS.base, JSON.stringify(state));

/** Returns the base saved in this tab, if any. */
export const loadBase = (): BaseState | undefined => {
  const saved = storage()?.getItem(KEYS.base);
  if (!saved) return undefined;
  try {
    return JSON.parse(saved) as BaseState;
  } catch {
    return undefined;
  }
};

/** Forgets the saved base, to play the act again from day 1. */
export const clearBase = () => {
  try {
    storage()?.removeItem(KEYS.base);
  } catch {
    // Nothing saved, or storage blocked: nothing to forget.
  }
};
