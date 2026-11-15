import { canAskHint } from '../core/help';
import { sideTorque } from '../core/torque';
import type { Hint } from '../core/hint';
import type { Session } from '../core/session';
import type { BalanceElements } from './layout';

/** The hint in words: which side pulls harder, then which weight to hang on which hook. */
const hintText = (session: Session, hint: Hint) => {
  const left = sideTorque(session.weights, 'left');
  const right = sideTorque(session.weights, 'right');
  const heavier =
    left === right ? '' : `The ${left > right ? 'left' : 'right'} side pulls harder. `;
  const where = `Hang the ${hint.mass} kg weight on hook ${hint.hook.distance}, ${hint.hook.side} side.`;
  return `Hint: ${heavier}${where}`;
};

/**
 * Shows the Hint button once the player may ask for one (greyed while a hint is shown), and the
 * hint itself in the line under the arm instead of the usual advice.
 */
export const renderHelp = (
  elements: BalanceElements,
  session: Session,
  hint: Hint | null,
  advice: string,
) => {
  elements.hint.textContent = hint === null ? advice : hintText(session, hint);
  elements.help.hidden = !canAskHint(session);
  elements.help.disabled = hint !== null;
};
