/** Colors of the drawing, taken from the page theme. */
export type MazePalette = { wall: string; floor: string; hatch: string };

/** Reads the theme colors once, from the CSS variables around the element. */
export const readPalette = (element: Element): MazePalette => {
  const style = getComputedStyle(element);
  const read = (name: string) => style.getPropertyValue(name).trim();
  return {
    wall: read('--signal-cyan'),
    floor: read('--space-navy'),
    hatch: read('--flare-orange'),
  };
};
