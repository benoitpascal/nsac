import { Group, MeshStandardMaterial } from 'three';
import { createBox, createCylinder } from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const CASE = { x: 0.9, y: 0.5, z: 0.6 };
const LID = { x: 0.94, y: 0.05, z: 0.64 };
const TERMINAL = { radius: 0.05, height: 0.08, offsetX: 0.3 };
const FIN = { x: 0.02, y: 0.4, z: 0.08, count: 7 };
const HANDLE = { x: 0.4, y: 0.03, z: 0.04, lift: 0.1 };
const POSITIVE_RED = 0xc8102e;
const NEGATIVE_BLACK = 0x161616;

const createTerminals = () => {
  const lidTop = CASE.y / 2 + LID.y;
  const terminals = new Group();
  for (const [side, color] of [
    [1, POSITIVE_RED],
    [-1, NEGATIVE_BLACK],
  ] as const) {
    const material = new MeshStandardMaterial({ color, roughness: 0.4 });
    const terminal = createCylinder(TERMINAL.radius, TERMINAL.height, 'y', material);
    terminal.position.set(side * TERMINAL.offsetX, lidTop + TERMINAL.height / 2, 0);
    terminals.add(terminal);
  }
  return terminals;
};

const createCoolingFins = (materials: SatelliteMaterials) => {
  const fins = new Group();
  const spacing = CASE.x / (FIN.count + 1);
  for (let index = 1; index <= FIN.count; index++) {
    for (const side of [1, -1]) {
      const fin = createBox(FIN, materials.metal);
      fin.position.set(-CASE.x / 2 + index * spacing, 0, side * (CASE.z / 2 + FIN.z / 2));
      fins.add(fin);
    }
  }
  return fins;
};

/**
 * Assembles a battery module: a dark case with cooling fins, a metal lid,
 * red and black terminals and a carrying handle.
 */
export const assembleBattery = (materials: SatelliteMaterials): Group => {
  const lid = createBox(LID, materials.metal);
  lid.position.y = CASE.y / 2 + LID.y / 2;
  const handle = createBox(HANDLE, materials.metal);
  handle.position.y = CASE.y / 2 + LID.y + HANDLE.lift;
  const battery = new Group();
  battery.add(
    createBox(CASE, materials.darkMetal),
    lid,
    handle,
    createTerminals(),
    createCoolingFins(materials),
  );
  return battery;
};
