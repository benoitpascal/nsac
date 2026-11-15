import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { loadCampaign, saveCampaign } from '@/modules/scenario/infra/campaign-storage';
import { createVoicePlayer } from '@/modules/scenario/infra/voice-player';
import { readDefaultView, writeDefaultView } from '@/modules/planet-walk/infra/view-preference';
import { isSoundMuted, setSoundMuted } from '@/modules/sound/infra/sound-preferences';
import { installClickSounds, playEffect, playMusic } from '@/modules/sound/infra/sound-player';
import { mountBriefing } from '@/modules/scenario/ui/briefing-router.view';
import { createTerminalBand } from '@/modules/scenario/ui/terminal-band.view';
import { requireElement } from '@/shared/dom';

const band = createTerminalBand(
  {
    day: requireElement<HTMLElement>('#band-day'),
    sun: requireElement<HTMLElement>('#band-sun'),
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
  voice: createVoicePlayer(),
  menuFirst: new URLSearchParams(window.location.search).has('menu'),
  view: { get: readDefaultView, set: writeDefaultView },
  onAnswer: (correct) => playEffect(correct ? 'valid' : 'wrong'),
  sound: { isMuted: isSoundMuted, setMuted: setSoundMuted },
});

installClickSounds();
playMusic('dashboard');
