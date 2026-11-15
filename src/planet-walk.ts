import { clearBase, saveRegolith } from '@/modules/moon-base/infra/campaign-store';
import { loadStarCatalog } from '@/modules/solar-system/infra/star-catalog';
import { startDayOneMission } from '@/modules/planet-walk/ui/mission/day-one-mission.view';
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

const worldPicker = requireElement<HTMLElement>('#world-picker');

const walk = mountPlanetWalk(
  {
    canvas: requireElement<HTMLCanvasElement>('#planet-walk'),
    worldPicker,
    factsPanel: requireElement<HTMLElement>('#walk-facts'),
    viewToggle: requireElement<HTMLButtonElement>('#view-toggle'),
    pilotPrompt: requireElement<HTMLButtonElement>('#pilot-prompt'),
    dashboard: requireElement<HTMLElement>('#station-dashboard'),
    touchPad: requireElement<HTMLElement>('#touch-pad'),
    excavatorHud: requireElement<HTMLElement>('#excavator-hud'),
  },
  { loadStars: loadStarCatalog, now: startClock() },
);

// Reached from the daily briefing, the walk plays that day's mission instead of free roaming.
// A new day one starts a new act, so the base saved from an earlier act is forgotten.
if (new URLSearchParams(window.location.search).get('mission') === 'day-one') {
  clearBase();
  startDayOneMission(
    walk,
    {
      panel: requireElement<HTMLElement>('#mission-panel'),
      ending: requireElement<HTMLDialogElement>('#mission-end'),
      worldPicker,
      backLink: requireElement<HTMLAnchorElement>('#walk-back'),
    },
    saveRegolith,
  );
}
