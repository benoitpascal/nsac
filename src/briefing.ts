import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { loadCampaign, saveCampaign } from '@/modules/scenario/infra/campaign-storage';
import { mountBriefing } from '@/modules/scenario/ui/briefing-router.view';
import { createTerminalBand } from '@/modules/scenario/ui/terminal-band.view';
import { requireElement } from '@/shared/dom';

const band = createTerminalBand(
  {
    day: requireElement<HTMLElement>('#band-day'),
    time: requireElement<HTMLTimeElement>('#band-time'),
    progress: requireElement<HTMLElement>('#mission-progress'),
    progressValue: requireElement<HTMLElement>('#mission-progress-value'),
  },
  MOON_ACT,
  Date.now,
);

mountBriefing(requireElement<HTMLElement>('#guide'), {
  act: MOON_ACT,
  load: loadCampaign,
  save: saveCampaign,
  now: Date.now,
  navigate: (url) => window.location.assign(url),
  onState: band.update,
});
