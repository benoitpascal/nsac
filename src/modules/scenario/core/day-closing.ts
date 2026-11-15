import { bricksFrom, NIGHT_COST, PRINTER } from './printer';
import type { CampaignState } from './campaign';
import type { Day, GuidePage } from './scenario-content';

const QUALITY_WORDS = {
  optimal: 'perfectly tuned',
  partial: 'tuned well enough',
  failed: 'badly tuned',
};

/**
 * Returns the mascot's end of the day: on a printer day, what the two jobs brought, then the choice
 * to run the printer through the night (bricks for power) or keep the regolith; on any other day,
 * just what the night costs.
 */
export const dayClosingPages = (state: CampaignState, day: Day): GuidePage[] => {
  const night = `Tonight the crew still breathes, drinks, eats and uses power: ${NIGHT_COST.air} points of air, water, food and power.`;
  if (day.closing === 'night') return [{ kind: 'text', text: `The day's work is done. ${night}` }];
  const kg = Math.floor(state.cargo.regolithKg);
  return [
    {
      kind: 'text',
      text: `Both jobs are done! We have ${kg} kg of regolith, and the printer is ${QUALITY_WORDS[state.printerQuality ?? 'failed']}.`,
    },
    {
      kind: 'choice',
      text: `Do you want the printer to work by itself tonight? It would make ${bricksFrom(state.cargo, state.printerQuality ?? 'failed')} bricks, but use ${PRINTER.powerPoints} points of power.`,
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
