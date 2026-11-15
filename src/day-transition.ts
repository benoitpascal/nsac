import { startCampaign } from '@/modules/moon-base/core/campaign';
import { loadCampaign, saveCampaign } from '@/modules/moon-base/infra/campaign-store';
import { mountDayTransition } from '@/modules/moon-base/ui/day-transition.view';
import { requireElement } from '@/shared/dom';

// Coming from the intro video (`?new`), the demo starts over from day 1.
if (new URLSearchParams(window.location.search).has('new')) saveCampaign(startCampaign());

mountDayTransition(
  {
    title: requireElement<HTMLElement>('.day-one__title'),
    solarValue: requireElement<HTMLElement>('#day-solar-value'),
    solarLabel: requireElement<HTMLElement>('#day-solar-label'),
    next: requireElement<HTMLAnchorElement>('.day-one__next'),
    alert: requireElement<HTMLElement>('#solar-alert'),
  },
  loadCampaign(),
);
