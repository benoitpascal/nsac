import { bindPointer } from './pointer';
import type { Hook, Weight } from '../core/types';
import type { DropTarget } from './drop-target';

/** What the controls read from and do to the game being played. */
export type PlayControls = {
  paused: () => boolean;
  weights: () => readonly Weight[];
  selected: () => number | null;
  select: (id: number | null) => void;
  place: (id: number, hook: Hook | null) => void;
};

/**
 * Wires the pointer to the game: drag a free weight onto a hook or the tray, or tap a weight to
 * pick it, then tap a hook, the tray or another hung weight to put it there.
 */
export const bindControls = (root: HTMLElement, game: PlayControls) => {
  const weightOf = (id: number) => game.weights().find((weight) => weight.id === id);
  const dropOn = (id: number, target: DropTarget) => {
    if (target.kind === 'hook') game.place(id, target.hook);
    else if (target.kind === 'tray') game.place(id, null);
  };
  bindPointer(root, {
    canGrab: (id) => !game.paused() && weightOf(id)?.locked === false,
    onDrop: dropOn,
    onTapTarget: (target) => {
      const selected = game.selected();
      if (selected !== null) dropOn(selected, target);
    },
    onTapWeight: (id) => {
      const selected = game.selected();
      const hook = weightOf(id)?.hook ?? null;
      if (selected !== null && selected !== id && hook !== null) return game.place(selected, hook);
      if (weightOf(id)?.locked !== false) return;
      game.select(selected === id ? null : id);
    },
  });
};
