import type { Goal } from '../../core/hud/excavator-goals';

/**
 * Fills the HUD's « today's goal » checklist, only when a goal changed. Returns how to show the
 * next goals.
 */
export const createGoalList = (hud: HTMLElement) => {
  const list = hud.querySelector<HTMLElement>('.walk-goals__list');
  let shown = '';
  return (goals: readonly Goal[]) => {
    const key = goals.map((goal) => `${goal.done}${goal.label}`).join('|');
    if (!list || key === shown) return;
    shown = key;
    list.replaceChildren(
      ...goals.map((goal) => {
        const item = document.createElement('li');
        item.className = goal.done ? 'walk-goals__item walk-goals__item--done' : 'walk-goals__item';
        item.textContent = goal.label;
        return item;
      }),
    );
  };
};
