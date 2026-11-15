import { BufferGeometry } from 'three';
import { finish, gridIndices } from './ground-buffers';
import { shadedHeight } from './ground-shade';
import { hillHeight } from './relief';

/** The near ground: a square grid around the start, flat where one walks (m). */
const NEAR = { size: 1400, cells: 560 };
/** The far ground: rings of hills out to the horizon (m). */
const FAR = { from: 690, to: 3200, rings: 90, segments: 360 };
/**
 * The near ground, its shape kept flat where one walks while its normals show the relief, its
 * corners left to the far ground's rings.
 */
export const nearGeometry = () => {
  const side = NEAR.cells + 1;
  const step = NEAR.size / NEAR.cells;
  const at = (index: number) => -NEAR.size / 2 + index * step;
  const heights = Array.from({ length: side * side }, (_, index) =>
    shadedHeight(at(index % side), at(Math.floor(index / side))),
  );
  const height = (column: number, row: number) =>
    heights[Math.min(Math.max(row, 0), side - 1) * side + Math.min(Math.max(column, 0), side - 1)];
  const positions: number[] = [];
  const normals: number[] = [];
  for (let row = 0; row < side; row++) {
    for (let column = 0; column < side; column++) {
      positions.push(at(column), hillHeight(at(column), at(row)), at(row));
      const slopeX = (height(column + 1, row) - height(column - 1, row)) / (2 * step);
      const slopeZ = (height(column, row + 1) - height(column, row - 1)) / (2 * step);
      const length = Math.hypot(slopeX, 1, slopeZ);
      normals.push(-slopeX / length, 1 / length, -slopeZ / length);
    }
  }
  const geometry = new BufferGeometry();
  const reach = FAR.from + 2 * step;
  const inside = (index: number) =>
    Math.hypot(at(index % side), at(Math.floor(index / side))) < reach;
  const triangles = gridIndices(side, side);
  const kept: number[] = [];
  for (let first = 0; first < triangles.length; first += 3) {
    const corners = triangles.slice(first, first + 3);
    if (corners.some(inside)) kept.push(...corners);
  }
  geometry.setIndex(kept);

  return finish(geometry, positions, normals);
};

/** The far ground, in rings getting wider towards the horizon. */
export const farGeometry = () => {
  const positions: number[] = [];
  for (let ring = 0; ring <= FAR.rings; ring++) {
    const radius = FAR.from * (FAR.to / FAR.from) ** (ring / FAR.rings);
    for (let segment = 0; segment <= FAR.segments; segment++) {
      const angle = (segment / FAR.segments) * Math.PI * 2;
      const [x, z] = [Math.cos(angle) * radius, Math.sin(angle) * radius];
      positions.push(x, hillHeight(x, z), z);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setIndex(gridIndices(FAR.rings + 1, FAR.segments + 1).reverse());
  return finish(geometry, positions, null);
};
