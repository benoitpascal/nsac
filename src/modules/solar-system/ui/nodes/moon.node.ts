import { BufferGeometry, Group, LineBasicMaterial, LineLoop, Vector3 } from 'three';
import { geocentricMoonPosition } from '../../core/moon-orbit';
import { moonOrbitRadius, moonSceneOffset } from './geocentric-scale';
import { createSizedBody } from './sized-body';
import type { ScaleMode } from './display-scale';
import type { SizedBody } from './sized-body';
import type { Body } from '@/modules/globe/ui/bodies/body';
import type { CelestialBody } from '@/modules/globe/core/bodies';

export type MoonNode = SizedBody & {
  holder: Group;
  orbitLine: LineLoop;
  moveTo: (timestamp: number) => void;
};

const ORBIT_SAMPLES = 96;
const ORBIT_COLOR = 0x9aa8d1;
const ORBIT_OPACITY = 0.35;
const FULL_TURN = Math.PI * 2;

const createOrbitLine = () => {
  const points = Array.from({ length: ORBIT_SAMPLES }, (_, index) => {
    const angle = (index / ORBIT_SAMPLES) * FULL_TURN;
    return new Vector3(Math.cos(angle), 0, Math.sin(angle));
  });
  const material = new LineBasicMaterial({
    color: ORBIT_COLOR,
    transparent: true,
    opacity: ORBIT_OPACITY,
  });
  return new LineLoop(new BufferGeometry().setFromPoints(points), material);
};

/**
 * Places the Moon around the Earth (both to be added to the Earth holder), where it really is
 * at the given time, sized and at a distance for the given scale. Its orbit is drawn as a
 * unit circle scaled to the mean distance.
 */
export const createMoonNode = (
  moon: CelestialBody & { id: 'moon' },
  body: Body,
  mode: ScaleMode,
  timestamp: number,
): MoonNode => {
  const holder = new Group();
  const sized = createSizedBody(moon, body, holder, mode, 'planet-label--moon');
  const orbitLine = createOrbitLine();
  let scale = mode;
  const moveTo = (at: number) => {
    const offset = moonSceneOffset(geocentricMoonPosition(at), scale);
    holder.position.set(offset.x, offset.y, offset.z);
  };
  const setScaleMode = (next: ScaleMode) => {
    scale = next;
    sized.setScaleMode(next);
    orbitLine.scale.setScalar(moonOrbitRadius(next));
  };
  setScaleMode(mode);
  moveTo(timestamp);
  return { holder, orbitLine, moveTo, focus: sized.focus, setScaleMode };
};
