import { createWires, isRightWire } from '../core/wires';
import { createButton, createElement, shake } from './panel';
import { createSwatch, WIRE_SYMBOLS } from './wire-look';
import type { Random } from '../core/random';
import type { WireRule } from '../core/wires';
import type { PanelEvents } from './panel';

const ODD_PICTURE = ['●', '●', '●', '○'];

const createRulePicture = (rule: WireRule) => {
  const picture = createElement('span', 'mg-defuse-rule-picture');
  if (rule.kind === 'colour') picture.append(createSwatch(rule.colour, 'mg-defuse-swatch'));
  if (rule.kind === 'light') picture.append(createElement('span', 'mg-defuse-bulb', '💡'));
  if (rule.kind === 'odd') {
    ODD_PICTURE.forEach((dot, index) => {
      const odd = index === ODD_PICTURE.length - 1;
      picture.append(createElement('span', odd ? 'mg-defuse-odd' : 'mg-defuse-same', dot));
    });
  }
  return picture;
};

const createRuleCard = (rule: WireRule) => {
  const card = createElement('div', 'mg-defuse-rule');
  card.append(createElement('span', 'mg-defuse-scissors', '✂️'), createRulePicture(rule));
  if (rule.kind === 'light') card.append(createSwatch(rule.colour, 'mg-defuse-light'));
  return card;
};

/** Shows coloured wires and a pictogram rule card; cutting the right wire solves the panel. */
export const createWiresPanel = (random: Random, events: PanelEvents) => {
  const puzzle = createWires(random);
  const panel = createElement('div', 'mg-defuse-panel mg-defuse-wires');
  const list = createElement('div', 'mg-defuse-wire-list');
  puzzle.wires.forEach((colour, index) => {
    const symbol = WIRE_SYMBOLS[colour];
    const wire = createButton(`mg-defuse-wire mg-defuse-colour-${colour}`, '', `${colour} wire`);
    wire.append(createElement('span', 'mg-defuse-wire-end', symbol));
    wire.append(createElement('span', 'mg-defuse-wire-end', symbol));
    wire.addEventListener('click', () => {
      if (isRightWire(puzzle, index)) events.solved();
      else {
        wire.classList.add('mg-defuse-wire-cut');
        wire.disabled = true;
        events.mistake();
        shake(panel);
      }
    });
    list.append(wire);
  });
  panel.append(createRuleCard(puzzle.rule), list);
  return panel;
};
