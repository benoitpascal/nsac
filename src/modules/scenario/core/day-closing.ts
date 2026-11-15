import { NIGHT_COST, PRINTER } from './printer';
import type { CampaignState } from './campaign';
import type { GuidePage } from './scenario-content';

const QUALITY_WORDS = {
  optimal: 'perfectly tuned',
  partial: 'tuned well enough',
  failed: 'badly tuned',
};

/** Returns the bricks the printer would make tonight from the regolith in store. */
export const bricksTonight = (state: CampaignState) =>
  Math.floor(
    Math.floor(state.cargo.regolithKg / PRINTER.kgPerBrick) *
      PRINTER.yield[state.printerQuality ?? 'failed'],
  );

/**
 * Returns the mascot's end of the day: what the two jobs brought, then the choice to run the
 * printer through the night (bricks for power) or keep the regolith, and what the night costs.
 */
export const dayClosingPages = (state: CampaignState): GuidePage[] => {
  const kg = Math.floor(state.cargo.regolithKg);
  const night = `Tonight the crew still breathes, drinks and uses power: ${NIGHT_COST.air} points of air, water and power.`;
  return [
    {
      kind: 'text',
      text: `Both jobs are done! We have ${kg} kg of regolith, and the printer is ${QUALITY_WORDS[state.printerQuality ?? 'failed']}.`,
    },
    {
      kind: 'choice',
      text: `Should the printer work by itself tonight? It would make ${bricksTonight(state)} bricks, but use ${PRINTER.powerPoints} points of power.`,
      options: [
        {
          label: 'Print bricks tonight',
          reply: [
            {
              kind: 'text',
              text: `The printer starts. Bricks will help us build a shelter. ${night}`,
            },
          ],
          effect: { kind: 'printBricks' },
        },
        {
          label: 'Keep the regolith for now',
          reply: [
            { kind: 'text', text: `We save power, but we will have no bricks tomorrow. ${night}` },
          ],
          effect: { kind: 'keepRegolith' },
        },
      ],
    },
  ];
};
