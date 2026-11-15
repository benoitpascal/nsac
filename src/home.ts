import { DAY_PAGE, DASHBOARD_PAGE } from '@/modules/scenario/core/mission-route';
import { clearCampaign, loadCampaign } from '@/modules/scenario/infra/campaign-storage';
import { readDefaultView, writeDefaultView } from '@/modules/planet-walk/infra/view-preference';
import { createVoicePlayer } from '@/modules/scenario/infra/voice-player';
import { renderSettings } from '@/modules/scenario/ui/settings.view';
import { isSoundMuted, setSoundMuted } from '@/modules/sound/infra/sound-preferences';
import { installClickSounds, playMusic } from '@/modules/sound/infra/sound-player';
import { requireElement } from '@/shared/dom';

const saved = loadCampaign();
const resume = requireElement<HTMLAnchorElement>('#home-continue');
const start = requireElement<HTMLAnchorElement>('#home-start');

/** Shows the button as the main one (filled in cyan, dark chevrons) or as a framed one. */
const highlight = (link: HTMLAnchorElement, main: boolean) => {
  link.classList.toggle('cut-button--primary', main);
  link.classList.toggle('cut-button--wide', !main);
  const chevrons = link.querySelector<HTMLImageElement>('.cut-button__chevrons');
  if (chevrons) chevrons.src = `/arcadia/act-select/chevrons-small${main ? '-dark' : ''}.svg`;
};

// Continue appears only with a saved game, opens the screen where it stopped, and is then the
// main button; otherwise Start playing is.
highlight(resume, Boolean(saved));
highlight(start, !saved);
if (saved) {
  resume.hidden = false;
  resume.href = saved.stage === 'dayEnd' ? DAY_PAGE : DASHBOARD_PAGE;
  requireElement<HTMLElement>('#home-continue-label').textContent =
    `Continue · Day ${String(saved.dayIndex + 1).padStart(2, '0')}`;
}

// Start playing always starts over.
start.addEventListener('click', clearCampaign);

// Options opens the game's settings, the same as the terminal's, in place of the menu.
const menu = requireElement<HTMLElement>('.home__menu');
const settings = requireElement<HTMLElement>('#home-settings');
const cards = requireElement<HTMLElement>('#home-settings-cards');
const settingsDeps = {
  voice: createVoicePlayer(),
  view: { get: readDefaultView, set: writeDefaultView },
  sound: { isMuted: isSoundMuted, setMuted: setSoundMuted },
};
const drawSettings = () => cards.replaceChildren(renderSettings(settingsDeps));
const showSettings = (open: boolean) => {
  menu.hidden = open;
  settings.hidden = !open;
  if (open) drawSettings();
};
requireElement<HTMLButtonElement>('#home-options').addEventListener('click', () =>
  showSettings(true),
);
requireElement<HTMLButtonElement>('#home-settings-back').addEventListener('click', () =>
  showSettings(false),
);

installClickSounds();
playMusic('title');
