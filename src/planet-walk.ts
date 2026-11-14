import { mountPlanetWalk } from '@/modules/planet-walk/ui/planet-walk.view';
import { requireElement } from '@/shared/dom';

mountPlanetWalk({
  canvas: requireElement<HTMLCanvasElement>('#planet-walk'),
  worldPicker: requireElement<HTMLElement>('#world-picker'),
  factsPanel: requireElement<HTMLElement>('#walk-facts'),
  viewToggle: requireElement<HTMLButtonElement>('#view-toggle'),
  pilotPrompt: requireElement<HTMLButtonElement>('#pilot-prompt'),
  dashboard: requireElement<HTMLElement>('#station-dashboard'),
  touchPad: requireElement<HTMLElement>('#touch-pad'),
  excavatorHud: requireElement<HTMLElement>('#excavator-hud'),
});
