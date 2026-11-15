import type { Campaign } from '@/modules/moon-base/core/campaign';
import { launchAction, shelterDone } from '@/modules/moon-base/core/actions';
import { startCampaign } from '@/modules/moon-base/core/campaign';
import { calibrationDone, nextDay, robotDone } from '@/modules/moon-base/core/day-steps';
import { loadCampaign, saveCampaign } from '@/modules/moon-base/infra/campaign-store';
import { mountChallenge } from '@/modules/moon-base/ui/challenge.view';
import { laserMirrorsGame } from '@/modules/minigames/games/laser-mirrors';
import { precisionBalanceGame } from '@/modules/minigames/games/precision-balance';
import { requireElement } from '@/shared/dom';

const id =
  new URLSearchParams(window.location.search).get('game') === 'shelter' ? 'shelter' : 'calibration';

/**
 * The campaign this challenge continues. Opened on its own (for a demo shortcut), the page starts
 * day 1, or makes up a well played day 1 and the shelter chosen on day 2.
 */
const campaignFor = (saved: Campaign | undefined): Campaign => {
  if (id === 'calibration') return saved?.stage === 'dayOne' ? saved : startCampaign();
  if (saved?.stage === 'construction') return saved;
  const dayTwo = nextDay(calibrationDone(robotDone(startCampaign(), 50, false), 100), 'planning');
  return launchAction(dayTwo, 'shelter');
};

mountChallenge(
  {
    title: requireElement<HTMLElement>('#challenge-title'),
    story: requireElement<HTMLElement>('#challenge-story'),
    board: requireElement<HTMLElement>('#challenge-board'),
    result: requireElement<HTMLElement>('#challenge-result'),
  },
  {
    id,
    game: id === 'shelter' ? precisionBalanceGame : laserMirrorsGame,
    campaign: campaignFor(loadCampaign()),
    finish: id === 'shelter' ? shelterDone : calibrationDone,
    save: saveCampaign,
  },
);
