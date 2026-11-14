import { Group } from 'three';
import { createSizedBody } from './sized-body';
import type { ScaleMode } from './display-scale';
import type { SizedBody } from './sized-body';
import type { Body } from '@/modules/globe/ui/bodies/body';
import type { CelestialBody } from '@/modules/globe/core/bodies';

export type SunNode = SizedBody & {
  holder: Group;
};

/** Places the Sun at the center of the scene, with its clickable name. */
export const createSunNode = (
  sun: CelestialBody & { id: 'sun' },
  body: Body,
  mode: ScaleMode,
): SunNode => {
  const holder = new Group();
  return { holder, ...createSizedBody(sun, body, holder, mode) };
};
