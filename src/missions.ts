import { mountActSelect } from '@/modules/act-select/ui/act-select.view';
import { requireElement } from '@/shared/dom';
import { installClickSounds } from '@/modules/sound/infra/sound-player';

mountActSelect({
  page: document.body,
  objective: requireElement<HTMLElement>('.acts__objective-text'),
  choices: [...document.querySelectorAll<HTMLButtonElement>('.act-choice')],
  start: requireElement<HTMLAnchorElement>('.cut-button--start'),
});

installClickSounds();
