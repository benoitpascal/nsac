import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineLoop } from 'three';
import { earthOrbitPath } from '../../../core/spacecraft/orbits/earth-orbit';
import { geocentricSceneOffset } from '../../nodes/geocentric-scale';
import type { ScaleMode } from '../../nodes/display-scale';
import type { EarthOrbitElements } from '../../../core/spacecraft/orbits/earth-orbit-elements';

export type SatelliteOrbitLine = {
  line: LineLoop;
  /** Redraws the orbit as it is at the given time (Unix ms), for the given scale. */
  draw: (timestamp: number, mode: ScaleMode) => void;
};

const SAMPLES = 128;
const OPACITY = 0.25;

/** Creates the drawn orbit of a satellite around the Earth, in the given color. */
export const createSatelliteOrbitLine = (
  orbit: EarthOrbitElements,
  color: number,
): SatelliteOrbitLine => {
  const positions = new BufferAttribute(new Float32Array(SAMPLES * 3), 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', positions);
  const material = new LineBasicMaterial({ color, transparent: true, opacity: OPACITY });
  const line = new LineLoop(geometry, material);
  line.frustumCulled = false;
  return {
    line,
    draw: (timestamp, mode) => {
      earthOrbitPath(orbit, timestamp, SAMPLES).forEach((point, index) => {
        const { x, y, z } = geocentricSceneOffset(point, mode);
        positions.setXYZ(index, x, y, z);
      });
      positions.needsUpdate = true;
    },
  };
};
