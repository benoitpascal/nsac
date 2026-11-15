import type { Command, CommandKey } from '../../core/hud/command-legend';

const KEY_LABELS: Record<CommandKey, string> = { move: '', space: 'Space', e: 'E', v: 'V' };

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

/**
 * The command legend of the walk (Figma « Legend command »): one line per key that does something
 * right now, redrawn only when the list changes.
 */
export const createCommandLegend = (element: HTMLElement, press: () => void) => {
  let shown = '';
  return {
    update: (commands: readonly Command[]) => {
      const key = JSON.stringify(commands);
      if (key === shown) return;
      shown = key;
      element.replaceChildren(...commands.map((command) => row(command, press)));
      element.hidden = commands.length === 0;
    },
  };
};
