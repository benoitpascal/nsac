import { MINI_GAMES } from '@/modules/minigames/games/registry';
import { mountMiniGames } from '@/modules/minigames/ui/minigames.view';
import { installClickSounds, playMusic } from '@/modules/sound/infra/sound-player';
import { requireElement } from '@/shared/dom';

mountMiniGames(
  {
    menu: requireElement<HTMLElement>('#minigames-menu'),
    screen: requireElement<HTMLElement>('#minigames-screen'),
    title: requireElement<HTMLElement>('#minigames-title'),
    quit: requireElement<HTMLButtonElement>('#minigames-quit'),
    board: requireElement<HTMLElement>('#minigames-board'),
    result: requireElement<HTMLElement>('#minigames-result'),
  },
  MINI_GAMES,
);

installClickSounds();
playMusic('minigames');
