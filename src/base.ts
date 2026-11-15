import { launchAction } from '@/modules/moon-base/core/actions';
import { startCampaign } from '@/modules/moon-base/core/campaign';
import { calibrationDone, nextDay, robotDone } from '@/modules/moon-base/core/day-steps';
import { loadCampaign, saveCampaign } from '@/modules/moon-base/infra/campaign-store';
import { renderPlanning } from '@/modules/moon-base/ui/planning.view';
import { requireElement } from '@/shared/dom';

/** The day 2 campaign; opened on its own, the page makes up a well played day 1. */
const saved = loadCampaign();
const campaign =
  saved?.stage === 'planning'
    ? saved
    : nextDay(calibrationDone(robotDone(startCampaign(), 50, false), 100), 'planning');

renderPlanning(
  {
    day: requireElement<HTMLElement>('#plan-day'),
    stocks: requireElement<HTMLElement>('#plan-stocks'),
    actions: requireElement<HTMLElement>('#plan-actions'),
  },
  campaign.day,
  campaign.stocks,
  (action) => {
    const launched = launchAction(campaign, action);
    saveCampaign(launched);
    window.location.href =
      launched.stage === 'construction' ? '/challenge.html?game=shelter' : '/debrief.html';
  },
);
