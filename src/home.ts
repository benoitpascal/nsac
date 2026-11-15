import { DAY_PAGE, DASHBOARD_PAGE } from '@/modules/scenario/core/mission-route';
import { clearCampaign, loadCampaign } from '@/modules/scenario/infra/campaign-storage';
import { requireElement } from '@/shared/dom';

const saved = loadCampaign();
const resume = requireElement<HTMLAnchorElement>('#home-continue');
const start = requireElement<HTMLAnchorElement>('#home-start');

// Continue appears only with a saved game, and opens the screen where it stopped.
if (saved) {
  resume.hidden = false;
  resume.href = saved.stage === 'dayEnd' ? DAY_PAGE : DASHBOARD_PAGE;
  requireElement<HTMLElement>('#home-continue-label').textContent =
    `Continue · Day ${String(saved.dayIndex + 1).padStart(2, '0')}`;
}

// Start playing always starts over.
start.addEventListener('click', clearCampaign);
