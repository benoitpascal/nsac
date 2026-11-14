import { cycleBodyIndex } from '../core/bodies';
import type { BodyCatalog, CelestialBody, SwitchStep } from '../core/bodies';

const STEP_BY_KEY: Partial<Record<string, SwitchStep>> = { ArrowLeft: -1, ArrowRight: 1 };

/**
 * Wires the previous / next arrows (and the arrow keys while an arrow has focus) to cycle
 * through the catalog, showing the selected body's name. Selects the catalog's initial body.
 */
export const mountBodySwitcher = (
  switcher: HTMLElement,
  catalog: BodyCatalog,
  onSelect: (body: CelestialBody) => void,
) => {
  const nameLabel = switcher.querySelector<HTMLElement>('[data-body-name]');
  let index = catalog.initialIndex;

  const select = (nextIndex: number) => {
    index = nextIndex;
    const body = catalog.bodies[index];
    if (nameLabel) nameLabel.textContent = body.name;
    onSelect(body);
  };

  for (const button of switcher.querySelectorAll<HTMLButtonElement>('[data-step]')) {
    const step: SwitchStep = button.dataset.step === '-1' ? -1 : 1;
    button.addEventListener('click', () => select(cycleBodyIndex(catalog, index, step)));
  }
  switcher.addEventListener('keydown', (event) => {
    const step = STEP_BY_KEY[event.key];
    if (step) select(cycleBodyIndex(catalog, index, step));
  });

  select(index);
};
