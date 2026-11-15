// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { mountActSelect } from '@/modules/act-select/ui/act-select.view';

const choice = (planet: string, locked: boolean) => {
  const button = document.createElement('button');
  button.dataset.planet = planet;
  if (locked) button.setAttribute('aria-disabled', 'true');
  return button;
};

const countOpenings = (event: Event) => {
  if (!event.defaultPrevented) opened += 1;
  event.preventDefault();
};
let opened = 0;
document.addEventListener('click', countOpenings);

describe('choosing an act', () => {
  let earth: HTMLButtonElement;
  let moon: HTMLButtonElement;
  let start: HTMLAnchorElement;

  beforeEach(() => {
    document.body.dataset.planet = 'earth';
    earth = choice('earth', true);
    moon = choice('moon', false);
    start = document.createElement('a');
    start.setAttribute('aria-disabled', 'true');
    opened = 0;
    document.body.replaceChildren(start);
    mountActSelect({ page: document.body, choices: [earth, moon], start });
  });

  it('shows the hovered planet, then comes back to the default one', () => {
    moon.dispatchEvent(new Event('pointerenter'));
    expect(document.body.dataset.planet).toBe('moon');
    moon.dispatchEvent(new Event('pointerleave'));
    expect(document.body.dataset.planet).toBe('earth');
  });

  it('does not start before an act is picked', () => {
    start.click();
    expect(opened).toBe(0);
  });

  it('ignores a locked act', () => {
    earth.click();
    expect([earth.getAttribute('aria-pressed'), start.getAttribute('aria-disabled')]).toEqual([
      null,
      'true',
    ]);
  });

  it('selects the open act, keeps its planet shown and enables Start mission', () => {
    moon.click();
    moon.dispatchEvent(new Event('pointerleave'));
    expect([
      moon.getAttribute('aria-pressed'),
      start.hasAttribute('aria-disabled'),
      document.body.dataset.planet,
    ]).toEqual(['true', false, 'moon']);
  });

  it('starts the act when it is picked again', () => {
    moon.click();
    moon.click();
    expect(opened).toBe(1);
  });
});
