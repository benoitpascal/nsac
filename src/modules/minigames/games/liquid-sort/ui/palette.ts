/** Look of one fuel color: a color-blind friendly fill and a symbol to tell it apart. */
export type FuelLook = { fill: string; symbol: string; name: string };

/** Fuel looks by color index (Okabe-Ito colors, each with its own shape). */
export const FUEL_LOOKS: readonly FuelLook[] = [
  { fill: '#e69f00', symbol: '●', name: 'orange' },
  { fill: '#56b4e9', symbol: '▲', name: 'blue' },
  { fill: '#009e73', symbol: '■', name: 'green' },
  { fill: '#f0e442', symbol: '★', name: 'yellow' },
  { fill: '#cc79a7', symbol: '◆', name: 'pink' },
];

const FALLBACK_LOOK: FuelLook = { fill: '#ffffff', symbol: '?', name: 'unknown' };

/** Returns the look of a color index. */
export const fuelLook = (color: number) => FUEL_LOOKS[color] ?? FALLBACK_LOOK;
