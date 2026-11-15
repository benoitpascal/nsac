import { loadStarCatalog } from '@/modules/solar-system/infra/star-catalog';
import { mountPlanetWalk } from '@/modules/planet-walk/ui/planet-walk.view';
import { requireElement } from '@/shared/dom';

/**
 * The base runs on the real time, unless the page is opened with `?time=<date>` (for example
 * `?time=2026-11-20T12:00Z`), which starts the clock at that date to show another time of day.
 */
const startClock = () => {
  const wanted = Date.parse(new URLSearchParams(window.location.search).get('time') ?? '');
  if (Number.isNaN(wanted)) return Date.now;
  const shift = wanted - Date.now();
  return () => Date.now() + shift;
};

mountPlanetWalk(
  {
    canvas: requireElement<HTMLCanvasElement>('#planet-walk'),
    worldPicker: requireElement<HTMLElement>('#world-picker'),
    factsPanel: requireElement<HTMLElement>('#walk-facts'),
    viewToggle: requireElement<HTMLButtonElement>('#view-toggle'),
    pilotPrompt: requireElement<HTMLButtonElement>('#pilot-prompt'),
    dashboard: requireElement<HTMLElement>('#station-dashboard'),
    touchPad: requireElement<HTMLElement>('#touch-pad'),
    excavatorHud: requireElement<HTMLElement>('#excavator-hud'),
  },
  { loadStars: loadStarCatalog, now: startClock() },
);
