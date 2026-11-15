import {
  BAG,
  DEFAULT_LOADOUT,
  loadoutProblem,
  robotEnergyKwh,
  secondsOutside,
  slotsUsed,
  TOOLS,
} from '../core/loadout';
import { button, cutButton, el } from './dom';
import type { BaseStores } from '../core/base-stores';
import type { Loadout } from '../core/loadout';
import type { ToolId } from '../core/scenario-content';

/**
 * Lets the player pack the bag: one tool, oxygen bottles and spare robot batteries, within 4 slots.
 * Returns the card and, under it, the row with the Go! button.
 */
export const renderPreparation = (stores: BaseStores, onGo: (loadout: Loadout) => void) => {
  let loadout: Loadout = { ...DEFAULT_LOADOUT };
  const panel = el('section', 'hud-panel preparation');
  const go = cutButton('Go!', 'wide', () => onGo(loadout), 'preparation__go');
  const actions = el('div', 'guide__actions');
  actions.append(go);
  const draw = () => {
    const problem = loadoutProblem(loadout, stores);
    const counter = (label: string, key: 'oxygenBottles' | 'spareBatteries', hint: string) => {
      const row = el('div', 'preparation__row');
      row.append(
        el('span', 'preparation__label', label),
        button('−', 'preparation__step', () => {
          loadout = { ...loadout, [key]: Math.max(0, loadout[key] - 1) };
          draw();
        }),
        el('span', 'preparation__count', String(loadout[key])),
        button('+', 'preparation__step', () => {
          loadout = { ...loadout, [key]: loadout[key] + 1 };
          draw();
        }),
        el('small', 'preparation__hint', hint),
      );
      return row;
    };
    const tools = el('div', 'preparation__row');
    tools.append(el('span', 'preparation__label', 'Tool'));
    for (const id of Object.keys(TOOLS) as ToolId[]) {
      const tool = TOOLS[id];
      const choice = button(
        `${tool.name} · ${tool.digKgPerSecond} kg/s · ${tool.drumKw} kW`,
        'preparation__tool',
        () => {
          loadout = { ...loadout, tool: id };
          draw();
        },
      );
      choice.setAttribute('aria-pressed', String(loadout.tool === id));
      tools.append(choice);
    }
    go.disabled = problem !== undefined;
    panel.replaceChildren(
      el('h2', 'preparation__title', `Pack your bag · ${slotsUsed(loadout)} / ${BAG.slots} slots`),
      tools,
      counter(
        'Oxygen bottles',
        'oxygenBottles',
        `Each one makes your suit's air last longer. Costs ${BAG.airPerBottle} air points when used up.`,
      ),
      counter(
        'Spare robot batteries',
        'spareBatteries',
        `Each one gives the robot another charge, taken from the base's power.`,
      ),
      el(
        'p',
        'preparation__summary',
        `Suit air for about ${Math.round((secondsOutside(loadout) / 60) * 10) / 10} min of calm work · robot energy ${Math.round(robotEnergyKwh(loadout) * 1000)} Wh · every item you carry makes you breathe a bit faster.`,
      ),
      el('p', 'preparation__problem', problem ?? ''),
    );
  };
  draw();
  return [panel, actions] as const;
};
