import { drawItem } from './shapes';
import type { ItemColour } from '../core/items';
import type { Option } from '../core/question';

/** Short word naming each colour, shown next to its swatch. */
const COLOUR_WORDS: Record<ItemColour, string> = {
  orange: 'Orange',
  blue: 'Blue',
  yellow: 'Yellow',
  pink: 'Pink',
};

const drawSwatch = (colour: ItemColour) => {
  const swatch = document.createElement('span');
  swatch.className = `mg-flash-observation-swatch mg-flash-observation--${colour}`;
  const word = document.createElement('span');
  word.className = 'mg-flash-observation-word';
  word.textContent = COLOUR_WORDS[colour];
  const wrap = document.createElement('span');
  wrap.className = 'mg-flash-observation-colour';
  wrap.append(swatch, word);
  return wrap;
};

/** Draws an option: an item icon, a named colour swatch, or a big number. */
export const drawOption = (option: Option): Element => {
  if (option.type === 'kind') return drawItem(option.kind);
  if (option.type === 'colour') return drawSwatch(option.colour);
  const number = document.createElement('span');
  number.className = 'mg-flash-observation-number';
  number.textContent = String(option.value);
  return number;
};

/** Name of an option for screen readers. */
export const optionLabel = (option: Option) => {
  if (option.type === 'kind') return option.kind;
  if (option.type === 'colour') return COLOUR_WORDS[option.colour];
  return String(option.value);
};
