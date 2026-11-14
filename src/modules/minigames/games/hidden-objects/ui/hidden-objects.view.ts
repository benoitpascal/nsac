import '../hidden-objects.css';
import { layoutBoard } from './board.view';
import { createHud } from './hud.view';
import { createScene } from './scene/scene.view';
import { showFound, showHint, showWrong } from './scene/effects';
import { createTargetList } from './target-list.view';
import { createTimeouts } from './timeouts';
import { huntResult, isOver, isWon, pickItem, startHunt, takeHint, tickHunt } from '../core/hunt';
import { generateLayout } from '../core/layout';
import type { Random } from '../core/item-kinds';
import type { PlacedItem } from '../core/layout';
import type { MiniGameResult, StopGame } from '../../../core/minigame';

const TICK_MS = 200;

/**
 * Plays one search in a newly generated workshop inside the container and calls finish once,
 * when every target is found or the time is up. Returns how to stop it.
 */
export const playHiddenObjects = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  random: Random,
): StopGame => {
  let hunt = startHunt(generateLayout(random));
  const { later, clearAll } = createTimeouts();
  const hud = createHud();
  const targets = createTargetList(hunt.layout.targets);
  let lastTick = performance.now();
  const refresh = () => hud.show(hunt);
  const end = () => {
    window.clearInterval(clock);
    refresh();
    finish(huntResult(hunt));
  };
  const onPick = (item: PlacedItem) => {
    const picked = pickItem(hunt, item);
    hunt = picked.hunt;
    if (picked.outcome === 'wrong') showWrong(scene, item, later);
    if (picked.outcome !== 'found') return;
    showFound(scene, item, later);
    targets.markFound(item.kind);
    if (isWon(hunt)) end();
  };
  const scene = createScene(hunt.layout, onPick);
  const clock = window.setInterval(() => {
    const now = performance.now();
    hunt = tickHunt(hunt, now - lastTick);
    lastTick = now;
    refresh();
    if (isOver(hunt)) end();
  }, TICK_MS);
  hud.hint.addEventListener('click', () => {
    const hinted = takeHint(hunt);
    hunt = hinted.hunt;
    if (hinted.item) showHint(scene, hinted.item, later);
    refresh();
  });
  container.replaceChildren(layoutBoard([hud.clock, targets.element, hud.hint], scene.svg));
  refresh();
  return () => {
    window.clearInterval(clock);
    clearAll();
    container.replaceChildren();
  };
};
