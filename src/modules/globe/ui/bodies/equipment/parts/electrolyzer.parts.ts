import { Group, MeshStandardMaterial } from 'three';
import { createBox, createCylinder } from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const BASE = { x: 1, y: 0.1, z: 0.5 };
const HOUSING = { x: 0.45, y: 0.55, z: 0.4 };
const COLUMN = { radius: 0.08, height: 0.65, offsetX: 0.36, capHeight: 0.06 };
const PIPE = { radius: 0.025, elevation: 0.42 };
const INDICATOR = { x: 0.12, y: 0.06, z: 0.01, height: 0.42 };
const OXYGEN_BLUE = 0x3b82f6;
const HYDROGEN_WHITE = 0xf5f5f5;
const READY_GREEN = 0x22c55e;

const createColumn = (side: 1 | -1, capColor: number, materials: SatelliteMaterials) => {
  const baseTop = BASE.y / 2;
  const column = createCylinder(COLUMN.radius, COLUMN.height, 'y', materials.metal);
  column.position.y = baseTop + COLUMN.height / 2;
  const capMaterial = new MeshStandardMaterial({ color: capColor, roughness: 0.4 });
  const cap = createCylinder(COLUMN.radius * 1.05, COLUMN.capHeight, 'y', capMaterial);
  cap.position.y = baseTop + COLUMN.height + COLUMN.capHeight / 2;
  const pipe = createCylinder(PIPE.radius, COLUMN.offsetX - HOUSING.x / 2, 'x', materials.metal);
  pipe.position.set((side * (HOUSING.x / 2 + COLUMN.offsetX)) / 2, baseTop + PIPE.elevation, 0);
  const group = new Group();
  group.add(column, cap);
  group.position.x = side * COLUMN.offsetX;
  const assembly = new Group();
  assembly.add(group, pipe);
  return assembly;
};

/**
 * Assembles an electrolyzer: a housing that splits water with electricity,
 * an oxygen column (blue cap) and a hydrogen column (white cap) on a common base.
 */
export const assembleElectrolyzer = (materials: SatelliteMaterials): Group => {
  const housing = createBox(HOUSING, materials.whitePaint);
  housing.position.y = BASE.y / 2 + HOUSING.y / 2;
  const indicatorMaterial = new MeshStandardMaterial({
    color: READY_GREEN,
    emissive: READY_GREEN,
    emissiveIntensity: 1.2,
  });
  const indicator = createBox(INDICATOR, indicatorMaterial);
  indicator.position.set(0, BASE.y / 2 + INDICATOR.height, HOUSING.z / 2 + INDICATOR.z / 2);
  const electrolyzer = new Group();
  electrolyzer.add(
    createBox(BASE, materials.darkMetal),
    housing,
    indicator,
    createColumn(1, OXYGEN_BLUE, materials),
    createColumn(-1, HYDROGEN_WHITE, materials),
  );
  electrolyzer.position.y = -(BASE.y + COLUMN.height) / 2;
  const centered = new Group();
  centered.add(electrolyzer);
  return centered;
};
