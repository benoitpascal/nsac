import type { Weight } from '../core/types';

const BLOCK = 'mg-precision-balance-weight';

/** Draws a weight block showing its mass; free weights can be grabbed, locked ones cannot. */
export const createWeightElement = (weight: Weight, selected: boolean) => {
  const block = document.createElement('span');
  block.className = `${BLOCK} ${BLOCK}--mass-${weight.mass}`;
  block.classList.toggle(`${BLOCK}--locked`, weight.locked);
  block.classList.toggle(`${BLOCK}--selected`, selected);
  block.dataset.weightId = String(weight.id);
  block.textContent = String(weight.mass);
  block.setAttribute('aria-label', `${weight.mass} kg${weight.locked ? ', locked' : ''}`);
  return block;
};
