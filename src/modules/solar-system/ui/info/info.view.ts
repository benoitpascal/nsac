import { bodyFacts } from '../../core/info/body-facts';
import { renderFactsSheet, renderSpacecraftSheet } from './info-content';
import { createInfoGuides } from './info-guides';
import type { BodyFocus, FocusTarget } from '../nodes/focus-target';
import type { SizedBodyId } from '../../core/body-radii';
import type { Scene } from 'three';

export type InfoView = {
  /** Switches the open facts panel to the given body, or closes it when there is none. */
  describe: (target: FocusTarget | undefined) => void;
  /** Refreshes the facts and guides for the given simulated time, while the panel is open. */
  update: (timestamp: number, elapsedSeconds: number) => void;
};

const REFRESH_SECONDS = 0.25;

/**
 * Wires the info button next to each body or spacecraft name: it opens the facts panel about it,
 * refreshed as time flows, with guide lines from the Sun and the Earth drawn in the scene
 * while it is open. Pressing it again, or the panel's close button, closes the panel.
 */
export const mountInfo = (panel: HTMLElement, scene: Scene, targets: FocusTarget[]): InfoView => {
  const bodies = targets.filter((target): target is BodyFocus => target.kind === 'body');
  const find = (id: SizedBodyId) => bodies.find((target) => target.bodyId === id);
  const [sun, earth] = [find('sun'), find('earth')];
  const updateGuides =
    sun && earth ? createInfoGuides(scene, sun.object, earth.object) : () => undefined;
  const content = panel.querySelector<HTMLElement>('[data-info-content]') ?? panel;
  let described: FocusTarget | undefined;
  let sinceRefresh = REFRESH_SECONDS;

  const render = (timestamp: number) => {
    if (described?.kind === 'spacecraft') {
      content.replaceChildren(...renderSpacecraftSheet(described, timestamp));
      return;
    }
    if (!described || !earth) return;
    const comparison = (described.bodyId === 'earth' ? find('moon') : undefined) ?? earth;
    content.replaceChildren(...renderFactsSheet(described, earth, comparison, timestamp));
  };

  const show = (target: FocusTarget | undefined) => {
    described = target;
    panel.hidden = target === undefined;
    for (const each of targets)
      each.infoButton.setAttribute('aria-expanded', String(each === target));
    sinceRefresh = REFRESH_SECONDS;
  };
  for (const target of targets) {
    target.infoButton.setAttribute('aria-controls', panel.id);
    target.infoButton.addEventListener('click', () =>
      show(described === target ? undefined : target),
    );
  }
  panel.querySelector('[data-info-close]')?.addEventListener('click', () => show(undefined));
  show(undefined);

  return {
    describe: (target) => {
      if (described) show(target);
    },
    update: (timestamp, elapsedSeconds) => {
      const shown = described;
      const body = shown?.kind === 'body' ? shown : undefined;
      updateGuides(body && { object: body.object, ...bodyFacts(body.bodyId, timestamp) });
      sinceRefresh += elapsedSeconds;
      if (!shown || sinceRefresh < REFRESH_SECONDS) return;
      sinceRefresh = 0;
      render(timestamp);
    },
  };
};
