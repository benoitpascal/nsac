import { MINI_GAMES } from '@/modules/minigames/games/registry';
import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { newCampaign } from '@/modules/scenario/core/campaign';
import { loadCampaign, saveCampaign } from '@/modules/scenario/infra/campaign-storage';
import { playMissionGame } from '@/modules/scenario/ui/mission-game.view';
import { requireElement } from '@/shared/dom';

playMissionGame(
  requireElement<HTMLElement>('#mission-title'),
  requireElement<HTMLElement>('#mission-board'),
  {
    act: MOON_ACT,
    state: loadCampaign() ?? newCampaign(Date.now()),
    games: MINI_GAMES,
    save: saveCampaign,
    navigate: (url) => window.location.assign(url),
  },
);
