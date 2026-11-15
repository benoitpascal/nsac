import type { WireColour } from '../core/wires';

/** A shape drawn on each wire colour, so colours are told apart without seeing them. */
export const WIRE_SYMBOLS: Record<WireColour, string> = {
  red: '▲',
  blue: '●',
  yellow: '★',
  green: '■',
  white: '◆',
};

/** Creates a small coloured swatch carrying the colour's shape. */
export const createSwatch = (colour: WireColour, className: string) => {
  const swatch = document.createElement('span');
  swatch.className = `${className} mg-defuse-colour-${colour}`;
  swatch.textContent = WIRE_SYMBOLS[colour];
  return swatch;
};
