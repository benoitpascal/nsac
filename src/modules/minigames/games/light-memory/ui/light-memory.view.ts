import { renderBoard } from './board.view';
import { lightForKey } from './keys';
import { playSequence } from './playback';
import { createTimers } from './timers';
import { createTones } from './tones';
import { WIN_LENGTH, growMemory, memoryScore, pressLight, startMemory } from '../core/memory';
import type { Memory } from '../core/memory';
import type { MiniGameResult, StopGame } from '../../../core/minigame';

/** How long a light shines when the player presses it (ms). */
const PRESS_MS = 250;
/** Wait before the result once the game is over (ms). */
const END_MS = 900;
const ON_CLASS = 'mg-light-memory-light--on';
const WRONG_CLASS = 'mg-light-memory-light--wrong';

/**
 * Runs Light Memory in the container: shows a growing sequence of lights, then lets the player
 * repeat it with clicks, taps or keys 1 to 4 and arrows. Returns how to stop it.
 */
export const startLightMemory = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  random: () => number,
): StopGame => {
  const timers = createTimers();
  const tones = createTones();
  const board = renderBoard(container);
  let memory: Memory = startMemory(random);
  let listening = false;
  const flash = (light: number, ms: number) => {
    board.lights[light]?.classList.add(ON_CLASS);
    tones.play(light, ms);
    timers.after(ms, () => board.lights[light]?.classList.remove(ON_CLASS));
  };
  const showSequence = () => {
    board.status.textContent = 'Watch';
    board.round.textContent = `${String(memory.sequence.length)} / ${String(WIN_LENGTH)}`;
    playSequence(timers, memory.sequence, flash, () => {
      listening = true;
      board.status.textContent = 'Your turn!';
    });
  };
  const end = (won: boolean) => {
    board.status.textContent = won ? 'Well done!' : 'Oops!';
    timers.after(END_MS, () => finish({ won, score: memoryScore(memory, won) }));
  };
  const press = (light: number) => {
    tones.unlock();
    if (!listening || light < 0) return;
    const result = pressLight(memory, light);
    if (result.outcome === 'mistake') board.lights[light]?.classList.add(WRONG_CLASS);
    else flash(light, PRESS_MS);
    memory = result.memory;
    if (result.outcome === 'next') return;
    listening = false;
    if (result.outcome === 'round') {
      memory = growMemory(memory, random);
      showSequence();
    } else end(result.outcome === 'won');
  };
  const onKey = (event: KeyboardEvent) => {
    const light = lightForKey(event.key);
    if (light < 0) return;
    event.preventDefault();
    press(light);
  };
  board.lights.forEach((button, light) => button.addEventListener('click', () => press(light)));
  window.addEventListener('keydown', onKey);
  tones.unlock();
  showSequence();
  return () => {
    timers.clear();
    tones.close();
    window.removeEventListener('keydown', onKey);
    container.replaceChildren();
  };
};
