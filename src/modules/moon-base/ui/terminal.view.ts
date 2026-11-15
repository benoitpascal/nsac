import { dayOneTasks } from '../core/day-steps';
import { element } from './element';
import { QUALITY_TEXTS } from './texts';
import type { Campaign } from '../core/campaign';

export type TerminalElements = {
  root: HTMLElement;
  day: HTMLElement;
  tasks: HTMLElement;
  status: HTMLElement;
  debrief: HTMLAnchorElement;
};

/** Time (ms) the console stays in view before the zoom into its screen. */
const ZOOM_DELAY_MS = 900;

type Task = { title: string; text: string; href: string; done: boolean; result: string };

const robotResult = (campaign: Campaign) =>
  campaign.notes.includes('robotStranded')
    ? 'Done: the robot was towed back.'
    : 'Done: the robot is back with its regolith.';

const tasksOf = (campaign: Campaign): Task[] => {
  const done = dayOneTasks(campaign);
  return [
    {
      title: 'Drive the digging robot',
      text: 'Collect 5 units of regolith, then bring the robot home before its battery runs out.',
      href: '/planet-walk.html?mission=day-one',
      done: done.robot,
      result: done.robot ? robotResult(campaign) : 'To do',
    },
    {
      title: 'Calibrate the 3D printer',
      text: 'Aim the laser that melts regolith into bricks. It uses some of the base power.',
      href: '/challenge.html?game=calibration',
      done: done.printer,
      result: campaign.printer ? QUALITY_TEXTS.calibration[campaign.printer] : 'To do',
    },
  ];
};

/** A task card: a link while to do, a plain card once done (a task is played only once). */
const taskCard = (task: Task) => {
  const card = element(task.done ? 'div' : 'a', 'terminal-task');
  if (card instanceof HTMLAnchorElement) card.href = task.href;
  if (task.done) card.dataset.done = '';
  card.append(
    element('h2', 'terminal-task__title', task.title),
    element('p', 'terminal-task__text', task.text),
    element('p', 'terminal-task__state', task.result),
  );
  const item = element('li', 'terminal__task');
  item.append(card);
  return item;
};

/**
 * Shows the base terminal of day 1: after a zoom into its screen, the day's two tasks, to play in
 * any order; once both are done, the day's debrief.
 */
export const mountTerminal = (elements: TerminalElements, campaign: Campaign) => {
  const tasks = tasksOf(campaign);
  const dayOver = campaign.stage === 'debrief';
  elements.day.textContent = String(campaign.day).padStart(2, '0');
  elements.tasks.replaceChildren(...tasks.map(taskCard));
  const left = tasks.filter((task) => !task.done).length;
  elements.status.textContent = dayOver
    ? 'Both tasks are done. Time to see how the day went!'
    : left === 2
      ? 'Do both tasks, in the order you like.'
      : 'One task left.';
  elements.debrief.hidden = !dayOver;
  window.setTimeout(() => elements.root.classList.add('terminal--zoomed'), ZOOM_DELAY_MS);
};
