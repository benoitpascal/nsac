import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { newCampaign } from '@/modules/scenario/core/campaign';
import { loadCampaign, saveCampaign } from '@/modules/scenario/infra/campaign-storage';
import { showDayTitle } from '@/modules/scenario/ui/day-title.view';
import { requireElement } from '@/shared/dom';
import { installClickSounds, playMusic } from '@/modules/sound/infra/sound-player';

const state = loadCampaign() ?? newCampaign(Date.now());
saveCampaign(state);
showDayTitle(
  {
    title: requireElement('#day-title'),
    temperature: requireElement('#day-temperature'),
    sun: requireElement('#day-sun'),
    crew: requireElement('#day-crew'),
    date: requireElement('#day-date'),
    alert: requireElement<HTMLElement>('#solar-alert'),
  },
  state,
  MOON_ACT,
  saveCampaign,
  (url) => location.assign(url),
);

installClickSounds();
playMusic('day');
