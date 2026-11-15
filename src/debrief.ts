import { nextDay } from '@/modules/moon-base/core/day-steps';
import { loadCampaign, saveCampaign } from '@/modules/moon-base/infra/campaign-store';
import { renderDebrief } from '@/modules/moon-base/ui/debrief.view';
import { requireElement } from '@/shared/dom';

const campaign = loadCampaign();
const next = requireElement<HTMLAnchorElement>('#debrief-next');

if (campaign?.lastDay) {
  renderDebrief(
    {
      day: requireElement<HTMLElement>('#debrief-day'),
      notes: requireElement<HTMLElement>('#debrief-notes'),
      stocks: requireElement<HTMLElement>('#debrief-stocks'),
      time: requireElement<HTMLElement>('#debrief-time'),
    },
    campaign,
  );
  // Day 1 leads to the day 2 planning; the day after the shelter, the solar alert comes.
  next.addEventListener('click', () => {
    if (campaign.stage !== 'debrief') return;
    const afterShelterDay = campaign.lastDay?.notes.some((note) => note.startsWith('action:'));
    saveCampaign(nextDay(campaign, afterShelterDay ? 'alert' : 'planning'));
  });
} else {
  next.href = '/briefing.html';
}
