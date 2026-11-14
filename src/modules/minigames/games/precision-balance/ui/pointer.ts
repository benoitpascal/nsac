import { targetAt, targetOf } from './drop-target';
import type { DropTarget } from './drop-target';

/** What the player does with the pointer, in mouse or touch alike. */
export type PointerActions = {
  canGrab: (id: number) => boolean;
  onTapWeight: (id: number) => void;
  onTapTarget: (target: DropTarget) => void;
  onDrop: (id: number, target: DropTarget) => void;
};

/** A press moving less than this (px) is a tap, not a drag. */
const DRAG_THRESHOLD_PX = 8;
const GHOST_CLASS = 'mg-precision-balance-ghost';
const DRAGGED_CLASS = 'mg-precision-balance-weight--dragged';

const createGhost = (root: HTMLElement, block: HTMLElement) => {
  const ghost = block.cloneNode(true) as HTMLElement;
  ghost.classList.add(GHOST_CLASS);
  root.append(ghost);
  block.classList.add(DRAGGED_CLASS);
  return ghost;
};

const placeGhost = (root: HTMLElement, ghost: HTMLElement, event: PointerEvent) => {
  const box = root.getBoundingClientRect();
  ghost.style.left = `${event.clientX - box.left}px`;
  ghost.style.top = `${event.clientY - box.top}px`;
};

const follow = (root: HTMLElement, block: HTMLElement, id: number, actions: PointerActions) => {
  return (down: PointerEvent) => {
    let ghost: HTMLElement | null = null;
    block.setPointerCapture(down.pointerId);
    const move = (event: PointerEvent) => {
      const far = Math.hypot(event.clientX - down.clientX, event.clientY - down.clientY);
      if (ghost === null && far > DRAG_THRESHOLD_PX) ghost = createGhost(root, block);
      if (ghost !== null) placeGhost(root, ghost, event);
    };
    const end = (event: PointerEvent) => {
      block.removeEventListener('pointermove', move);
      block.removeEventListener('pointerup', end);
      block.removeEventListener('pointercancel', end);
      ghost?.remove();
      block.classList.remove(DRAGGED_CLASS);
      if (event.type === 'pointercancel') return;
      if (ghost === null) actions.onTapWeight(id);
      else actions.onDrop(id, targetAt(event.clientX, event.clientY));
    };
    block.addEventListener('pointermove', move);
    block.addEventListener('pointerup', end);
    block.addEventListener('pointercancel', end);
  };
};

/** Listens to presses inside the game: drag a weight, tap a weight, or tap a hook or the tray. */
export const bindPointer = (root: HTMLElement, actions: PointerActions) => {
  root.addEventListener('pointerdown', (event) => {
    const element = event.target instanceof Element ? event.target : null;
    const block = element?.closest<HTMLElement>('[data-weight-id]');
    if (!block) return actions.onTapTarget(targetOf(element));
    const id = Number(block.dataset.weightId);
    if (!actions.canGrab(id)) return actions.onTapWeight(id);
    event.preventDefault();
    follow(root, block, id, actions)(event);
  });
};
