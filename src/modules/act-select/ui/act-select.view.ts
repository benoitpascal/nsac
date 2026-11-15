export type ActSelectElements = {
  page: HTMLElement;
  objective: HTMLElement;
  choices: readonly HTMLButtonElement[];
  start: HTMLAnchorElement;
};

const DEFAULT_PLANET = 'earth';
/** The objective of each act, shown for the hovered or picked planet. */
const OBJECTIVES: Record<string, string> = {
  earth: 'Training time on Earth: discover the basics of astronomy before you fly.',
  moon: 'Learn how to run a base on the Moon.',
  mars: 'Build the base on Mars, and get it ready for the next astronauts.',
};

/**
 * Wires the act selection: hovering or focusing a card shows its planet in the header and the
 * background, and its act's objective instead of the journey's (every text sits in the same
 * place, so the block keeps the height of the longest one); locked acts cannot be picked; picking
 * the open act selects it and enables Start mission, and picking it again starts it.
 */
export const mountActSelect = ({ page, objective, choices, start }: ActSelectElements) => {
  let selected: HTMLButtonElement | undefined;
  const texts = { journey: objective.textContent.trim(), ...OBJECTIVES };
  const spans = Object.entries(texts).map(([key, text]) => {
    const span = document.createElement('span');
    span.className = 'acts__objective-option';
    span.dataset.objective = key;
    span.textContent = text;
    return span;
  });
  objective.replaceChildren(...spans);
  const showPlanet = (planet: string | undefined) => {
    const pointed = planet ?? selected?.dataset.planet;
    page.dataset.planet = pointed ?? DEFAULT_PLANET;
    const shown = pointed && pointed in OBJECTIVES ? pointed : 'journey';
    for (const span of spans) span.hidden = span.dataset.objective !== shown;
  };
  showPlanet(undefined);
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
