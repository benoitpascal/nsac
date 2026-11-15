/** The view the walk starts in: through the astronaut's eyes, or from behind them. */
export type DefaultView = 'first' | 'third';

const KEY = 'arcadia.defaultView';

/** Returns the view chosen in the terminal's settings; first person when none was chosen. */
export const readDefaultView = (): DefaultView => {
  try {
    return localStorage.getItem(KEY) === 'third' ? 'third' : 'first';
  } catch {
    return 'first';
  }
};

/** Saves the view the walk starts in. */
export const writeDefaultView = (view: DefaultView) => {
  try {
    localStorage.setItem(KEY, view);
  } catch {
    // The choice then only lasts for this page.
  }
};
