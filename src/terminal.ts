import { startCampaign } from '@/modules/moon-base/core/campaign';
import { loadCampaign, saveCampaign } from '@/modules/moon-base/infra/campaign-store';
import { mountTerminal } from '@/modules/moon-base/ui/terminal.view';
import { requireElement } from '@/shared/dom';

/** Day 1's campaign; opened on its own, the page starts one. */
const campaign = loadCampaign() ?? startCampaign();
saveCampaign(campaign);

mountTerminal(
  {
    root: requireElement<HTMLElement>('.terminal'),
    day: requireElement<HTMLElement>('#terminal-day'),
    tasks: requireElement<HTMLElement>('#terminal-tasks'),
    status: requireElement<HTMLElement>('#terminal-status'),
    debrief: requireElement<HTMLAnchorElement>('#terminal-debrief'),
  },
  campaign,
);
