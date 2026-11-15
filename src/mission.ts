import { MINI_GAMES } from '@/modules/minigames/games/registry';
import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { newCampaign } from '@/modules/scenario/core/campaign';
import { loadCampaign, saveCampaign } from '@/modules/scenario/infra/campaign-storage';
import { playMissionGame } from '@/modules/scenario/ui/mission-game.view';
import { createTerminalBand } from '@/modules/scenario/ui/terminal-band.view';
import { installClickSounds, playEffect, playMusic } from '@/modules/sound/infra/sound-player';
import { requireElement } from '@/shared/dom';

const state = loadCampaign() ?? newCampaign(Date.now());
createTerminalBand(
  {
    day: requireElement<HTMLElement>('#band-day'),
    sun: requireElement<HTMLElement>('#band-sun'),
    time: requireElement<HTMLTimeElement>('#band-time'),
    progress: requireElement<HTMLElement>('#mission-progress'),
    progressValue: requireElement<HTMLElement>('#mission-progress-value'),
  },
  MOON_ACT,
  Date.now,
).update(state);

playMissionGame(
  requireElement<HTMLElement>('#mission-title'),
  requireElement<HTMLElement>('#mission-board'),
  {
    act: MOON_ACT,
    state,
    games: MINI_GAMES,
    howTo: requireElement<HTMLElement>('#mission-howto'),
    save: saveCampaign,
    navigate: (url) => window.location.assign(url),
    onWin: () => playEffect('objective'),
  },
);

installClickSounds();
playMusic('minigames');
