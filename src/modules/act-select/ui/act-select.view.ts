export type ActSelectElements = {
  page: HTMLElement;
  choices: readonly HTMLButtonElement[];
  start: HTMLAnchorElement;
};

const DEFAULT_PLANET = 'earth';

/**
 * Wires the act selection: hovering or focusing a card shows its planet in the header and the
 * background; locked acts cannot be picked; picking the open act selects it and enables Start
 * mission, and picking it again starts it.
 */
export const mountActSelect = ({ page, choices, start }: ActSelectElements) => {
  let selected: HTMLButtonElement | undefined;
  const showPlanet = (planet: string | undefined) => {
    page.dataset.planet = planet ?? selected?.dataset.planet ?? DEFAULT_PLANET;
  };
  const select = (choice: HTMLButtonElement) => {
    if (selected === choice) return start.click();
    selected?.setAttribute('aria-pressed', 'false');
    selected = choice;
    choice.setAttribute('aria-pressed', 'true');
    start.removeAttribute('aria-disabled');
    showPlanet(choice.dataset.planet);
  };
  for (const choice of choices) {
    const open = choice.getAttribute('aria-disabled') !== 'true';
    choice.addEventListener('pointerenter', () => showPlanet(choice.dataset.planet));
    choice.addEventListener('focus', () => showPlanet(choice.dataset.planet));
    choice.addEventListener('pointerleave', () => showPlanet(undefined));
    choice.addEventListener('blur', () => showPlanet(undefined));
    if (open) choice.addEventListener('click', () => select(choice));
  }
  start.addEventListener('click', (event) => {
    if (!selected) event.preventDefault();
  });
};
