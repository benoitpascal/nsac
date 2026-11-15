import { Float32BufferAttribute } from 'three';
import { groundShade } from './ground-shade';
import type { BufferGeometry } from 'three';

/** Size (m) of one tile of the regolith texture. */
const TILE_M = 5;

/** Sets the points of a ground piece, with its texture places, its dust shade and its normals. */
export const finish = (geometry: BufferGeometry, positions: number[], normals: number[] | null) => {
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const uvs: number[] = [];
  const colors: number[] = [];
  for (let index = 0; index < positions.length; index += 3) {
    const [x, z] = [positions[index], positions[index + 2]];
    uvs.push(x / TILE_M, z / TILE_M);
    const shade = groundShade(x, z);
    colors.push(shade, shade, shade);
  }
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  if (normals) geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  else geometry.computeVertexNormals();
  return geometry;
};

/** Two triangles per cell of a grid of points laid row after row. */
export const gridIndices = (rows: number, columns: number) => {
  const indices: number[] = [];
  for (let row = 0; row < rows - 1; row++) {
    for (let column = 0; column < columns - 1; column++) {
      const corner = row * columns + column;
      indices.push(
        corner,
        corner + columns,
        corner + 1,
        corner + 1,
        corner + columns,
        corner + columns + 1,
      );
    }
  }
  return indices;
};
