import { jumpFacts } from '../core/jump-facts';
import type { WalkWorld } from '../core/walk-worlds';

const LOCALE = 'en-GB';
const PERCENT = 100;

const decimal = (value: number, digits: number) =>
  value.toLocaleString(LOCALE, { maximumFractionDigits: digits });

const paragraph = (text: string) => {
  const element = document.createElement('p');
  element.textContent = text;
  return element;
};

/** Shows the world's gravity and what it does to a jump and to your weight. */
export const showJumpFacts = (panel: HTMLElement, world: WalkWorld) => {
  const facts = jumpFacts(world.gravity);
  const heading = document.createElement('h2');
  heading.textContent = world.name;
  panel.replaceChildren(
    heading,
    paragraph(`Gravity: ${decimal(world.gravity, 2)} m/s².`),
    paragraph(`You weigh ${Math.round(facts.weightShare * PERCENT)}% of your weight on the Earth.`),
    paragraph(`A jump lifts your feet ${decimal(facts.heightM, 2)} m off the ground.`),
    paragraph(`You stay ${decimal(facts.airSeconds, 1)} s in the air.`),
  );
};
