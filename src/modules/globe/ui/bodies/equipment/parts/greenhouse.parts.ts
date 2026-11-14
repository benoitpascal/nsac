import { Group, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';
import { createBox, createCylinder } from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const BASE = { x: 1.1, y: 0.12, z: 0.55 };
const COVER = { x: 1.1, y: 0.5, z: 0.55 };
const PLANTS = { columns: 4, rows: 2, spacingX: 0.25, spacingZ: 0.24 };
const POT = { radius: 0.07, height: 0.07 };
const LEAVES = { radius: 0.1, flatten: 0.65 };
const LIGHT_BAR = { x: 1, y: 0.04, z: 0.12 };
const LETTUCE_GREENS = [0x4caf50, 0x7bc96f];
const GROW_LIGHT = 0xd946ef;
const GLASS_TINT = 0xd6f2ff;

const createPlant = (shade: number, materials: SatelliteMaterials) => {
  const pot = createCylinder(POT.radius, POT.height, 'y', materials.darkMetal);
  pot.position.y = POT.height / 2;
  const leafMaterial = new MeshStandardMaterial({ color: shade, roughness: 0.8 });
  const leaves = new Mesh(new SphereGeometry(LEAVES.radius, 16, 12), leafMaterial);
  leaves.scale.y = LEAVES.flatten;
  leaves.position.y = POT.height + LEAVES.radius * LEAVES.flatten * 0.6;
  const plant = new Group();
  plant.add(pot, leaves);
  return plant;
};

/**
 * Assembles a plant growth chamber: rows of lettuce under a glass cover,
 * lit by a pink-violet grow light bar.
 */
export const assembleGreenhouse = (materials: SatelliteMaterials): Group => {
  const baseTop = BASE.y / 2;
  const glass = new MeshStandardMaterial({
    color: GLASS_TINT,
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    depthWrite: false,
  });
  const cover = createBox(COVER, glass);
  cover.position.y = baseTop + COVER.y / 2;
  const lightMaterial = new MeshStandardMaterial({
    color: GROW_LIGHT,
    emissive: GROW_LIGHT,
    emissiveIntensity: 1.5,
  });
  const lightBar = createBox(LIGHT_BAR, lightMaterial);
  lightBar.position.y = baseTop + COVER.y - LIGHT_BAR.y;
  const greenhouse = new Group();
  greenhouse.add(createBox(BASE, materials.whitePaint), lightBar);
  for (let column = 0; column < PLANTS.columns; column++) {
    for (let row = 0; row < PLANTS.rows; row++) {
      const plant = createPlant(LETTUCE_GREENS[(column + row) % LETTUCE_GREENS.length], materials);
      plant.position.set(
        (column - (PLANTS.columns - 1) / 2) * PLANTS.spacingX,
        baseTop,
        (row - (PLANTS.rows - 1) / 2) * PLANTS.spacingZ,
      );
      greenhouse.add(plant);
    }
  }
  greenhouse.add(cover);
  greenhouse.position.y = -(BASE.y + COVER.y) / 2;
  const centered = new Group();
  centered.add(greenhouse);
  return centered;
};
