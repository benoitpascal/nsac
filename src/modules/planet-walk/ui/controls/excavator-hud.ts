import { batteryShare, EXCAVATOR, hasCharge, isFull } from '../../core/excavator/excavator-power';
import type { ExcavatorStore } from '../../core/excavator/excavator-power';
import type { createExcavatorDriving, RobotPlace } from './excavator-driving';

/** How long (s) the "battery empty" notice stays on screen after the robot stops. */
const EMPTY_NOTICE_SECONDS = 6;
/** Battery share below which the reading turns to a warning. */
const LOW_SHARE = 0.2;
const PERCENT = 100;
const EMPTY_NOTICE = 'Battery empty: the robot has stopped and you are back on foot.';
const LOW_NOTICE = 'Battery low!';

/** Where to go next, from where the robot is and what it carries (the keys are in the legend). */
const hint = (store: ExcavatorStore, place: RobotPlace) => {
  if (place === 'drop') return store.carriedKg > 0 ? 'Hold Space to unload' : 'Nothing to unload';
  if (isFull(store)) return 'Drums full: unload them in the red zone';
  if (place === 'dig') return 'Hold Space to dig';
  return store.carriedKg > 0
    ? 'Dig more in the yellow zone, or unload in the red zone'
    : 'Drive into the yellow zone to dig';
};

/**
 * Shows the excavator robot's panel while it is driven: its battery and its drums' load as bars,
 * and what to do next; when its battery runs out, the panel stays a few seconds to say so.
 */
export const createExcavatorHud = (
  element: HTMLElement,
  robot: ReturnType<typeof createExcavatorDriving>,
) => {
  const field = (name: string) => element.querySelector<HTMLElement>(`[data-robot="${name}"]`);
  const fill = (name: string) => element.querySelector<HTMLElement>(`[data-robot-fill="${name}"]`);
  const [battery, load, hintText] = [field('battery'), field('load'), field('hint')];
  const [batteryFill, loadFill] = [fill('battery'), fill('load')];
  const setText = (target: HTMLElement | null, text: string) => {
    if (target && target.textContent !== text) target.textContent = text;
  };
  let powered = true;
  let noticeLeft = 0;
  return {
    update: (seconds: number, driving: boolean) => {
      const store = robot.store();
      if (powered && !hasCharge(store)) noticeLeft = EMPTY_NOTICE_SECONDS;
      powered = hasCharge(store);
      noticeLeft = Math.max(0, noticeLeft - seconds);
      element.hidden = !driving && noticeLeft === 0;
      if (element.hidden) return;
      const charge = batteryShare(store);
      const low = charge < LOW_SHARE;
      setText(battery, `${Math.round(charge * PERCENT)} %`);
      setText(load, `${Math.round(store.carriedKg)} / ${EXCAVATOR.loadKg} kg`);
      if (batteryFill) batteryFill.style.width = `${charge * PERCENT}%`;
      if (loadFill) loadFill.style.width = `${(store.carriedKg / EXCAVATOR.loadKg) * PERCENT}%`;
      const next = hint(store, robot.place());
      setText(hintText, !powered ? EMPTY_NOTICE : low ? `${LOW_NOTICE} ${next}` : next);
      element.classList.toggle('walk-robot--low', low);
      element.classList.toggle('walk-robot--empty', !powered);
    },
  };
};
