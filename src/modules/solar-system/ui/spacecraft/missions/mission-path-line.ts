import { BufferGeometry, Line, LineDashedMaterial, Vector3 } from 'three';
import type { ScenePosition } from '../../../core/scene-scale';

export type MissionPathLine = {
  line: Line;
  /** Draws the path through the given points, with dashes sized to its length. */
  draw: (points: ScenePosition[]) => void;
};

const DASHES_ALONG_PATH = 300;
const OPACITY = 0.6;

/** Creates the dashed line showing where a mission flies, in the given color. */
export const createMissionPathLine = (color: number): MissionPathLine => {
  const material = new LineDashedMaterial({ color, transparent: true, opacity: OPACITY });
  const line = new Line(new BufferGeometry(), material);
  line.frustumCulled = false;
  return {
    line,
    draw: (points) => {
      line.geometry.setFromPoints(points.map(({ x, y, z }) => new Vector3(x, y, z)));
      line.computeLineDistances();
      const distances = line.geometry.getAttribute('lineDistance');
      const total = distances.count > 0 ? distances.getX(distances.count - 1) : 0;
      material.dashSize = total / DASHES_ALONG_PATH;
      material.gapSize = material.dashSize;
    },
  };
};
