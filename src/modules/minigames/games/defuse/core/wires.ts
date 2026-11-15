import { pickOne, randomIndex } from './random';
import type { Random } from './random';

/** Colours a wire can have. */
export type WireColour = 'red' | 'blue' | 'yellow' | 'green' | 'white';

/**
 * Which wire to cut: the only wire of a colour, the wire matching the light's colour,
 * or the one wire whose colour differs from all the others.
 */
export type WireRule =
  | { kind: 'colour'; colour: WireColour }
  | { kind: 'light'; colour: WireColour }
  | { kind: 'odd' };

/** Wires from top to bottom, the rule shown on the card, and the index of the wire to cut. */
export type WiresPanel = { wires: WireColour[]; rule: WireRule; target: number };

/** Every wire colour. */
export const WIRE_COLOURS: readonly WireColour[] = ['red', 'blue', 'yellow', 'green', 'white'];
const MIN_WIRES = 4;
const MAX_WIRES = 5;
const RULE_KINDS = ['colour', 'light', 'odd'] as const;

const otherColours = (colour: WireColour) => WIRE_COLOURS.filter((other) => other !== colour);

const ruleFor = (kind: (typeof RULE_KINDS)[number], colour: WireColour): WireRule =>
  kind === 'odd' ? { kind } : { kind, colour };

/** Builds a panel of 4 or 5 wires where exactly one wire follows the rule. */
export const createWires = (random: Random): WiresPanel => {
  const count = MIN_WIRES + randomIndex(random, MAX_WIRES - MIN_WIRES + 1);
  const target = randomIndex(random, count);
  const colour = pickOne(random, WIRE_COLOURS);
  const kind = pickOne(random, RULE_KINDS);
  const others = otherColours(colour);
  const shared = pickOne(random, others);
  const wires = Array.from({ length: count }, (_, index) => {
    if (index === target) return colour;
    return kind === 'odd' ? shared : pickOne(random, others);
  });
  return { wires, rule: ruleFor(kind, colour), target };
};

/** Tells whether cutting the wire at this index is right. */
export const isRightWire = (panel: WiresPanel, index: number) => index === panel.target;
