import { clearBase, saveRegolith } from '@/modules/moon-base/infra/campaign-store';
import { startDayOneMission } from '@/modules/planet-walk/ui/mission/day-one-mission.view';
import { mountPlanetWalk } from '@/modules/planet-walk/ui/planet-walk.view';
import { requireElement } from '@/shared/dom';

const worldPicker = requireElement<HTMLElement>('#world-picker');

const walk = mountPlanetWalk({
  canvas: requireElement<HTMLCanvasElement>('#planet-walk'),
  worldPicker,
  factsPanel: requireElement<HTMLElement>('#walk-facts'),
  viewToggle: requireElement<HTMLButtonElement>('#view-toggle'),
  pilotPrompt: requireElement<HTMLButtonElement>('#pilot-prompt'),
  dashboard: requireElement<HTMLElement>('#station-dashboard'),
  touchPad: requireElement<HTMLElement>('#touch-pad'),
  excavatorHud: requireElement<HTMLElement>('#excavator-hud'),
});

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
