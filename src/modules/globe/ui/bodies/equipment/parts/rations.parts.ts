import { Group, MeshStandardMaterial } from 'three';
import { createBox } from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const PACK = { x: 0.26, y: 0.16, z: 0.3, gap: 0.02 };
const GRID = { columns: 3, layers: 3, rows: 2 };
const LABEL_COLORS = [0xf59e0b, 0x22c55e, 0xef4444, 0xe8d8b0];
const LABEL = { y: 0.06, inset: 0.002 };
const NET_THICKNESS = 0.015;

const centered = (index: number, count: number, size: number) =>
  (index - (count - 1) / 2) * (size + PACK.gap);

const createPack = (labelIndex: number, materials: SatelliteMaterials) => {
  const pouch = createBox(PACK, materials.silverFoil);
  const labelMaterial = new MeshStandardMaterial({
    color: LABEL_COLORS[labelIndex % LABEL_COLORS.length],
    roughness: 0.7,
  });
  const label = createBox(
    { x: PACK.x + LABEL.inset, y: LABEL.y, z: PACK.z + LABEL.inset },
    labelMaterial,
  );
  const pack = new Group();
  pack.add(pouch, label);
  return pack;
};

const createNet = (size: { x: number; y: number; z: number }, materials: SatelliteMaterials) => {
  const net = new Group();
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const post = createBox({ x: NET_THICKNESS, y: size.y, z: NET_THICKNESS }, materials.metal);
      post.position.set((x * size.x) / 2, 0, (z * size.z) / 2);
      net.add(post);
    }
  }
  for (const y of [-1, 0, 1]) {
    const band = createBox({ x: size.x, y: NET_THICKNESS, z: size.z }, materials.metal);
    band.position.y = (y * size.y) / 2;
    net.add(band);
  }
  return net;
};

/**
 * Assembles a stack of food rations: foil pouches with colored labels, held in a cargo net.
 */
export const assembleRations = (materials: SatelliteMaterials): Group => {
  const rations = new Group();
  for (let column = 0; column < GRID.columns; column++) {
    for (let layer = 0; layer < GRID.layers; layer++) {
      for (let row = 0; row < GRID.rows; row++) {
        const pack = createPack(column + layer + row, materials);
        pack.position.set(
          centered(column, GRID.columns, PACK.x),
          centered(layer, GRID.layers, PACK.y),
          centered(row, GRID.rows, PACK.z),
        );
        rations.add(pack);
      }
    }
  }
  const stack = (count: number, size: number) => count * (size + PACK.gap);
  const netSize = {
    x: stack(GRID.columns, PACK.x),
    y: stack(GRID.layers, PACK.y),
    z: stack(GRID.rows, PACK.z),
  };
  rations.add(createNet(netSize, materials));
  return rations;
};
