const NEXT_KEYS = ['ArrowDown', 'ArrowRight'];
const PREVIOUS_KEYS = ['ArrowUp', 'ArrowLeft'];

const panelOf = (tab: HTMLButtonElement) => {
  const id = tab.getAttribute('aria-controls');
  const panel = id ? document.getElementById(id) : null;
  if (!panel) throw new Error(`Missing panel for tab ${tab.id}`);
  return panel;
};

/**
 * Turns the tab buttons of a `role="tablist"` into tabs: picking one shows its panel and
 * hides the others. Arrow keys, Home and End move between tabs.
 */
export const mountTopicTabs = (tabList: HTMLElement) => {
  const tabs = [...tabList.querySelectorAll<HTMLButtonElement>('[role="tab"]')];

  const select = (picked: HTMLButtonElement) => {
    tabs.forEach((tab) => {
      const isPicked = tab === picked;
      tab.setAttribute('aria-selected', String(isPicked));
      tab.tabIndex = isPicked ? 0 : -1;
      panelOf(tab).hidden = !isPicked;
    });
    picked.focus();
  };

  const targetOf = (key: string, index: number) => {
    if (NEXT_KEYS.includes(key)) return tabs[(index + 1) % tabs.length];
    if (PREVIOUS_KEYS.includes(key)) return tabs[(index - 1 + tabs.length) % tabs.length];
    if (key === 'Home') return tabs[0];
    if (key === 'End') return tabs[tabs.length - 1];
    return undefined;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      const target = targetOf(event.key, index);
      if (!target) return;
      event.preventDefault();
      select(target);
    });
  });
};
