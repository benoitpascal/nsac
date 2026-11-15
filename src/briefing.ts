import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { loadCampaign, saveCampaign } from '@/modules/scenario/infra/campaign-storage';
import { mountBriefing } from '@/modules/scenario/ui/briefing-router.view';
import { requireElement } from '@/shared/dom';

mountBriefing(requireElement<HTMLElement>('#guide'), {
  act: MOON_ACT,
  load: loadCampaign,
  save: saveCampaign,
  now: Date.now,
  navigate: (url) => window.location.assign(url),
});
