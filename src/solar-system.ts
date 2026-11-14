import { EPHEMERIS_MISSION_IDS } from '@/modules/solar-system/core/spacecraft/ephemeris';
import { loadStarCatalog } from '@/modules/solar-system/infra/star-catalog';
import { loadTrajectories } from '@/modules/solar-system/infra/trajectory-catalog';
import { mountSolarSystem } from '@/modules/solar-system/ui/solar-system.view';
import { requireElement } from '@/shared/dom';

void mountSolarSystem({
  canvas: requireElement<HTMLCanvasElement>('#solar-system'),
  labelLayer: requireElement<HTMLElement>('#solar-system-labels'),
  timePanel: requireElement<HTMLElement>('#time-controls'),
  speedPicker: requireElement<HTMLElement>('#speed-picker'),
  overviewButton: requireElement<HTMLButtonElement>('#overview'),
  loadStars: loadStarCatalog,
  loadTrajectories: () => loadTrajectories(EPHEMERIS_MISSION_IDS),
  eventsToggle: requireElement<HTMLButtonElement>('#events-toggle'),
  eventsPanel: requireElement<HTMLElement>('#events-panel'),
  scaleToggle: requireElement<HTMLButtonElement>('#scale-toggle'),
  infoPanel: requireElement<HTMLElement>('#info-panel'),
});
