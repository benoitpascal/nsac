import '../defuse.css';
import * as reactorRules from '../core/reactor';
import { createGauge, createSteps } from './gauge.view';
import { createKeypadPanel } from './keypad.view';
import { createElement } from './panel';
import { createSymbolsPanel } from './symbols.view';
import { createWiresPanel } from './wires.view';
import type { MiniGameResult, StopGame } from '../../../core/minigame';
import type { Random } from '../core/random';
import type { PanelEvents } from './panel';

/** Sources of chance and time, injected so the game can be replayed. */
export type DefuseClock = { random: Random; now: () => number };

const PANELS = [createWiresPanel, createKeypadPanel, createSymbolsPanel];

/** Runs the reactor game in the container and reports the result once. */
export const startDefuse = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  clock: DefuseClock,
): StopGame => {
  let reactor = reactorRules.startReactor();
  let frame = 0;
  let over = false;
  let last = clock.now();
  const root = createElement('div', 'mg-defuse');
  const gauge = createGauge();
  const steps = createSteps();
  const slot = createElement('div', 'mg-defuse-slot');
  root.append(gauge.element, steps.element, slot);
  container.replaceChildren(root);
  const refresh = () => {
    gauge.update(reactorRules.timeShare(reactor), reactor.timeLeftMs);
    steps.update(reactor.solvedPanels);
  };
  const end = () => {
    over = true;
    cancelAnimationFrame(frame);
    slot.replaceChildren();
    finish({ won: reactorRules.isCooled(reactor), score: reactorRules.scoreOf(reactor) });
  };
  const events: PanelEvents = {
    mistake: () => {
      reactor = reactorRules.makeMistake(reactor);
      refresh();
    },
    solved: () => {
      reactor = reactorRules.solvePanel(reactor);
      refresh();
      if (reactorRules.isCooled(reactor)) end();
      else showPanel();
    },
  };
  const showPanel = () => {
    const panel = PANELS[reactor.solvedPanels](clock.random, events);
    slot.replaceChildren(panel);
    panel.querySelector('button')?.focus();
  };
  const tick = () => {
    const time = clock.now();
    reactor = reactorRules.passTime(reactor, time - last);
    last = time;
    refresh();
    if (reactorRules.isOverheated(reactor)) end();
    else frame = requestAnimationFrame(tick);
  };
  showPanel();
  refresh();
  frame = requestAnimationFrame(tick);
  return () => {
    if (!over) cancelAnimationFrame(frame);
    over = true;
  };
};
