import { CONTROLS, CREDITS, GAME_GOAL, HOW_TO_PLAY } from '../core/terminal-help';
import { renderGauges } from './gauges.view';
import { controlRow } from './control-row.view';
import { button, el } from './dom';
import type { BaseStores } from '../core/base-stores';
import type { Objective } from '../core/progress';
import type { Voice } from '../core/voice';

export type TerminalMenuDeps = {
  /** Today's number, from 1. */
  day: () => number;
  objectives: () => readonly Objective[];
  stores: () => BaseStores;
  /** Opens the mascot's discussion or the mission's next step. */
  continueMission: () => void;
  /** Leaves the console, back to the 3D base. */
  leave: () => void;
  voice?: Voice;
};

const icon = (name: string) =>
  `<svg class="hud-icon" aria-hidden="true"><use href="/arcadia/hud-icons.svg#${name}" /></svg>`;

/** The Moon base picture on the left, as on the daily briefing. */
const basePicture = () => {
  const frame = el('div', 'hud-panel briefing__picture');
  const picture = el('img', '');
  Object.assign(picture, {
    src: '/arcadia/day-one-background.png',
    alt: 'The Moon base, with its domes, greenhouse and solar panels',
  });
  frame.append(picture);
  return frame;
};

const dayHeader = (day: number) => {
  const header = el('div', 'briefing__day');
  const label = el('p', 'briefing__day-label');
  label.innerHTML = `${icon('calendar')} Day `;
  label.append(el('span', 'briefing__day-number', String(day).padStart(2, '0')));
  header.append(label, el('p', 'briefing__place', 'Moon base · Sector Alpha'));
  return header;
};

/** A framed block of the briefing, with its icon and heading. */
const block = (iconName: string, heading: string, ...content: Node[]) => {
  const section = el('section', 'hud-panel');
  const title = el('h3', 'hud-panel__heading');
  title.innerHTML = icon(iconName);
  title.append(heading);
  section.append(title, ...content);
  return section;
};

const objectiveList = (objectives: readonly Objective[]) => {
  const list = el('ul', 'objectives');
  for (const objective of objectives) {
    const item = el('li', objective.done ? 'objective objective--done' : 'objective');
    const box = el('span', 'objective__box');
    if (objective.done) box.innerHTML = icon('check');
    item.append(box, el('span', '', objective.text));
    if (objective.done) item.append(el('span', 'visually-hidden', '(done)'));
    list.append(item);
  }
  return list;
};

const list = (tag: 'ol' | 'ul', items: readonly string[]) => {
  const element = el(tag, 'briefing__text terminal-menu__list');
  element.append(...items.map((item) => el('li', '', item)));
  return element;
};

const controls = () => {
  const table = el('dl', 'briefing__text terminal-menu__controls');
  for (const [keys, use] of CONTROLS) table.append(el('dt', '', keys), el('dd', '', use));
  return table;
};

/**
 * The terminal's home screen, laid out like the daily briefing (Moon base picture, then the day's
 * orders): Continue mission, Goal, Station resources, How to play, Controls and Settings, each
 * topic with Back under it.
 */
export const renderTerminalMenu = (root: HTMLElement, deps: TerminalMenuDeps) => {
  const orders = el('section', 'hud-panel briefing__orders terminal-menu');
  root.replaceChildren(basePicture(), orders);
  const show = (title: string, text: string, ...content: Node[]) => {
    orders.replaceChildren(
      dayHeader(deps.day()),
      el('h2', 'briefing__title', title),
      el('p', 'briefing__text', text),
      ...content,
    );
    orders.querySelector<HTMLElement>('button')?.focus();
  };
  /** The choices, as cards like the day's plan (planning.css). */
  const choices = (...cards: HTMLLIElement[]) => {
    const list = el('ul', 'planning__actions');
    list.setAttribute('aria-label', 'Terminal');
    list.append(...cards);
    return list;
  };
  const card = (title: string, text: string, action: string, onClick: () => void) => {
    const item = el('li', 'hud-panel plan-action');
    item.append(
      el('h3', 'plan-action__title', title),
      el('p', 'plan-action__text', text),
      button(action, 'hud-action plan-action__launch', onClick),
    );
    return item;
  };
  /** The control row: Back to the given screen (greyed out on the menu itself), then Leave. */
  const backTo = (screen?: () => void) => controlRow({ back: screen, leave: deps.leave });

  const settings = () => {
    const muted = deps.voice?.isMuted() ?? false;
    const sound = card(
      'Sound',
      muted ? 'The voices are off.' : 'The voices are on.',
      muted ? 'Turn on' : 'Turn off',
      () => {
        deps.voice?.setMuted(!muted);
        settings();
      },
    );
    show('Settings', 'Turn the voices on or off.', choices(sound), backTo(main));
  };
  const main = () =>
    show(
      'Station terminal',
      'What do you want to do?',
      choices(
        card(
          'Continue mission',
          "Meet the robot assistant and play today's job.",
          'Continue',
          deps.continueMission,
        ),
        card('Goal', 'What you must do today, and why.', 'Open', () => {
          const panels = el('div', 'briefing__panels');
          panels.append(block('target', "Today's goals", objectiveList(deps.objectives())));
          show('Goal', GAME_GOAL, panels, backTo(main));
        }),
        card('Station resources', 'Air, power, water and food left.', 'Open', () => {
          const panels = el('div', 'briefing__panels');
          panels.append(block('cube', 'Resources', renderGauges(deps.stores())));
          show('Station resources', 'What the base has left today.', panels, backTo(main));
        }),
        card('How to play', 'A day at the base, step by step.', 'Open', () =>
          show(
            'How to play',
            'A day at the base, step by step.',
            list('ol', HOW_TO_PLAY),
            el('p', 'objective__hint', CREDITS),
            backTo(main),
          ),
        ),
        card('Controls', 'The keys to move around the base.', 'Open', () =>
          show('Controls', 'The keys to move around the base.', controls(), backTo(main)),
        ),
        card('Settings', 'Turn the voices on or off.', 'Open', settings),
      ),
      backTo(),
    );
  main();
};
