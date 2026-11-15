import { isBalanced, isLevelSolved, tiltDegrees } from '../core/torque';
import { sameHook } from '../core/types';
import { createWeightElement } from './weight.view';
import type { BalanceElements } from './layout';
import type { Session } from '../core/session';

const PREFIX = 'mg-precision-balance';

const renderHooks = (elements: BalanceElements, session: Session, selected: number | null) => {
  elements.hooks.forEach(({ hook, element }) => {
    const label = document.createElement('span');
    label.className = `${PREFIX}-hook-label`;
    label.textContent = String(hook.distance);
    const weight = session.weights.find((candidate) => sameHook(candidate.hook, hook));
    const string = document.createElement('span');
    string.className = `${PREFIX}-string`;
    const hanging =
      weight === undefined ? [] : [string, createWeightElement(weight, weight.id === selected)];
    element.replaceChildren(label, ...hanging);
  });
};

const renderLevels = (elements: BalanceElements, session: Session) =>
  elements.levels.forEach((level, index) => {
    level.classList.toggle(`${PREFIX}-level--done`, index < session.levelIndex);
    level.classList.toggle(`${PREFIX}-level--current`, index === session.levelIndex);
  });

/** What to do next: a level is only solved when every weight hangs and the arm is level. */
const hintFor = (session: Session) => {
  const inTray = session.weights.some((weight) => weight.hook === null);
  const level = isBalanced(session.weights);
  if (!inTray) return level ? 'Level! Well done.' : 'The arm tilts. Move a weight to level it.';
  return level
    ? 'Level, but weights are still in the tray. Hang them all!'
    : 'Drag the orange weights onto the arm. Grey ones are fixed.';
};

/** Shows the session: tilt of the arm, hung weights, tray, level dots and the level glow. */
export const renderSession = (
  elements: BalanceElements,
  session: Session,
  selected: number | null,
) => {
  elements.beam.style.setProperty(`--${PREFIX}-angle`, `${tiltDegrees(session.weights)}deg`);
  renderHooks(elements, session, selected);
  const trayWeights = session.weights.filter((weight) => weight.hook === null);
  elements.tray.replaceChildren(
    ...trayWeights.map((weight) => createWeightElement(weight, weight.id === selected)),
  );
  elements.root.classList.toggle(`${PREFIX}-root--selecting`, selected !== null);
  elements.stage.classList.toggle(`${PREFIX}-stage--level`, isLevelSolved(session.weights));
  elements.hint.textContent = hintFor(session);
  renderLevels(elements, session);
};
