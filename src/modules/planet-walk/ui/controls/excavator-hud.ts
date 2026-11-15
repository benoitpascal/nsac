import { batteryShare, EXCAVATOR, hasCharge, isFull } from '../../core/excavator/excavator-power';
import type { ExcavatorStore } from '../../core/excavator/excavator-power';
import type { MagneticStorm } from '../../core/excavator/magnetic-storm';
import type { createExcavatorDriving, RobotPlace } from './excavator-driving';

/** How long (s) the "battery empty" notice stays on screen after the robot stops. */
const EMPTY_NOTICE_SECONDS = 6;
/** Battery share below which the reading turns to a warning. */
const LOW_SHARE = 0.2;
const PERCENT = 100;
const EMPTY_NOTICE = 'Excavator battery empty: the robot has stopped and you are back on foot';

const stormNotice = (storm: MagneticStorm) =>
  `Magnetic storm! The Z Q S D keys are scrambled (${Math.ceil(storm.secondsLeft)} s)`;

const tenths = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Where to go next, from where the robot is and what it carries (the keys are in the legend). */
const hint = (store: ExcavatorStore, place: RobotPlace) => {
  if (place === 'drop') return store.carriedKg > 0 ? undefined : 'Nothing to unload';
  if (isFull(store)) return 'Drums full: unload at the drop-off zone';
  return place === 'dig' ? undefined : 'Drive into the grey zone to dig';
};

const readout = (store: ExcavatorStore, place: RobotPlace) =>
  [
    `Battery ${tenths.format(batteryShare(store) * PERCENT)} %`,
    `Load ${tenths.format(store.carriedKg)} / ${EXCAVATOR.loadKg} kg`,
    hint(store, place),
  ]
    .filter(Boolean)
    .join(' · ');

/**
 * Shows the excavator robot's battery, its load and what to do next while it is driven, a warning
 * while a magnetic storm scrambles its keys, and a notice for a few seconds when its battery runs
 * out.
 */
export const createExcavatorHud = (
  element: HTMLElement,
  robot: ReturnType<typeof createExcavatorDriving>,
) => {
  let powered = true;
  let noticeLeft = 0;
  return {
    update: (seconds: number, driving: boolean) => {
      const [store, storm] = [robot.store(), robot.storm()];
      const raging = storm.phase === 'raging';
      if (powered && !hasCharge(store)) noticeLeft = EMPTY_NOTICE_SECONDS;
      powered = hasCharge(store);
      noticeLeft = Math.max(0, noticeLeft - seconds);
      element.hidden = !driving && noticeLeft === 0;
      if (element.hidden) return;
      const status = powered ? readout(store, robot.place()) : EMPTY_NOTICE;
      const text = raging && powered ? `${stormNotice(storm)} · ${status}` : status;
      if (element.textContent !== text) element.textContent = text;
      element.classList.toggle('excavator-hud--low', batteryShare(store) < LOW_SHARE);
      element.classList.toggle('excavator-hud--storm', raging);
    },
  };
};
