import type { Command, CommandKey } from '../../core/hud/command-legend';

const KEY_LABELS: Record<CommandKey, string> = {
  move: '',
  space: 'Space',
  e: 'E',
  v: 'V',
  t: 'T',
};

const keyBox = (key: CommandKey) => {
  const box = document.createElement('span');
  box.className = `command-legend__key command-legend__key--${key}`;
  box.setAttribute('aria-hidden', 'true');
  box.textContent = KEY_LABELS[key];
  return box;
};

const row = (command: Command, press: () => void) => {
  // The action key's line is a button too, for touch screens without an E key.
  const item = document.createElement(command.key === 'e' ? 'button' : 'div');
  item.className = `command-legend__item command-legend__item--${command.key}`;
  if (item instanceof HTMLButtonElement) {
    item.type = 'button';
    item.addEventListener('click', () => {
      press();
      item.blur();
    });
  }
  const text = document.createElement('span');
  text.className = 'command-legend__text';
  const title = document.createElement('span');
  title.className = 'command-legend__title';
  title.textContent = command.title;
  const detail = document.createElement('span');
  detail.className = 'command-legend__detail';
  detail.textContent = command.detail;
  text.append(title, detail);
  item.append(keyBox(command.key), text);
  return item;
};

/** How long (ms) the legend stays open before folding into its Help line. */
const OPEN_FOR_MS = 8000;
const HELP_KEY = 'KeyH';

/** The folded legend: a single H line that opens it again. */
const helpRow = (open: () => void) => {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'command-legend__item command-legend__item--help';
  const box = document.createElement('span');
  box.className = 'command-legend__key';
  box.setAttribute('aria-hidden', 'true');
  box.textContent = 'H';
  const text = document.createElement('span');
  text.className = 'command-legend__text';
  const title = document.createElement('span');
  title.className = 'command-legend__title';
  title.textContent = 'Help';
  text.append(title);
  item.append(box, text);
  item.addEventListener('click', () => {
    open();
    item.blur();
  });
  return item;
};

/**
 * The command legend of the walk (Figma « Legend command »): one line per key that does something
 * right now. It opens when the commands change, folds after a few seconds into a single « H · Help »
 * line, and H (or a click on that line) opens it again.
 */
export const createCommandLegend = (element: HTMLElement, press: () => void) => {
  let shown = '';
  let commands: readonly Command[] = [];
  let folded = false;
  let timer: number | undefined;
  const draw = () => {
    element.replaceChildren(
      ...(folded ? [helpRow(open)] : commands.map((command) => row(command, press))),
    );
    element.classList.toggle('command-legend--folded', folded);
    element.hidden = commands.length === 0;
  };
  const open = () => {
    folded = false;
    draw();
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      folded = true;
      draw();
    }, OPEN_FOR_MS);
  };
  window.addEventListener('keydown', (event) => {
    if (event.code === HELP_KEY && !event.repeat) open();
  });
  return {
    update: (next: readonly Command[]) => {
      const key = JSON.stringify(next);
      if (key === shown) return;
      shown = key;
      commands = next;
      open();
    },
  };
};
