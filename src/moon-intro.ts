import { MOON_INTRO_SHOTS } from '@/modules/moon-intro/core/intro-shots';
import { mountMoonIntro } from '@/modules/moon-intro/ui/moon-intro.view';
import { requireElement } from '@/shared/dom';

mountMoonIntro(
  {
    stage: requireElement<HTMLElement>('#moon-intro-stage'),
    skip: requireElement<HTMLButtonElement>('#moon-intro-skip'),
  },
  MOON_INTRO_SHOTS,
  '/day-one.html',
);
