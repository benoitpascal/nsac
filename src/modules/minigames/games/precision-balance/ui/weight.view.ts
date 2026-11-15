import type { Weight } from '../core/types';

const BLOCK = 'mg-precision-balance-weight';

/**
 * Draws a weight block showing its mass; free weights can be grabbed, locked ones cannot. A
 * hinted weight glows to show it is the one to move.
 */
export const createWeightElement = (weight: Weight, selected: boolean, hinted = false) => {
  const block = document.createElement('span');
  block.className = `${BLOCK} ${BLOCK}--mass-${weight.mass}`;
  block.classList.toggle(`${BLOCK}--locked`, weight.locked);
  block.classList.toggle(`${BLOCK}--selected`, selected);
  block.classList.toggle(`${BLOCK}--hint`, hinted);
  block.dataset.weightId = String(weight.id);
  block.textContent = String(weight.mass);
  block.setAttribute('aria-label', `${weight.mass} kg${weight.locked ? ', locked' : ''}`);
  return block;
};
