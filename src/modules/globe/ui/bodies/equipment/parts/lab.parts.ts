import { Group, MeshStandardMaterial } from 'three';
import { createBox, createCylinder } from '../../satellite/satellite.shapes';
import type { SatelliteMaterials } from '../../satellite/satellite.materials';

const RACK = { x: 0.7, y: 1, z: 0.45 };
const SCREEN = { x: 0.5, y: 0.22, z: 0.02, elevations: [0.3, 0.05] };
const DRAWER = { x: 0.55, y: 0.1, z: 0.02, elevations: [-0.18, -0.3, -0.42] };
const HANDLE = { x: 0.14, y: 0.02, z: 0.03 };
const MICROSCOPE = {
  baseSize: { x: 0.2, y: 0.03, z: 0.15 },
  pillar: 0.18,
  headSize: { x: 0.06, y: 0.08, z: 0.14 },
};
const EYEPIECE = { radius: 0.02, length: 0.1 };
const SCREEN_GLOW = 0x22d3ee;

const createFront = (materials: SatelliteMaterials) => {
  const front = new Group();
  const glow = new MeshStandardMaterial({
    color: SCREEN_GLOW,
    emissive: SCREEN_GLOW,
    emissiveIntensity: 0.8,
  });
  for (const elevation of SCREEN.elevations) {
    const screen = createBox(SCREEN, glow);
    screen.position.y = elevation;
    front.add(screen);
  }
  for (const elevation of DRAWER.elevations) {
    const drawer = createBox(DRAWER, materials.metal);
    drawer.position.y = elevation;
    const handle = createBox(HANDLE, materials.darkMetal);
    handle.position.set(0, elevation, DRAWER.z);
    front.add(drawer, handle);
  }
  front.position.z = RACK.z / 2 + SCREEN.z / 2;
  return front;
};

const createMicroscope = (materials: SatelliteMaterials) => {
  const base = createBox(MICROSCOPE.baseSize, materials.darkMetal);
  const pillar = createCylinder(0.02, MICROSCOPE.pillar, 'y', materials.metal);
  pillar.position.set(0, MICROSCOPE.pillar / 2, -0.04);
  const head = createBox(MICROSCOPE.headSize, materials.whitePaint);
  head.position.set(0, MICROSCOPE.pillar, 0);
  const eyepiece = createCylinder(EYEPIECE.radius, EYEPIECE.length, 'y', materials.darkMetal);
  eyepiece.position.set(0, MICROSCOPE.pillar + EYEPIECE.length / 2 + 0.03, -0.03);
  eyepiece.rotation.x = -0.4;
  const microscope = new Group();
  microscope.add(base, pillar, head, eyepiece);
  microscope.position.y = RACK.y / 2 + MICROSCOPE.baseSize.y / 2;
  return microscope;
};

/**
 * Assembles a science lab rack: glowing screens, drawers for samples
 * and a microscope on top.
 */
export const assembleLab = (materials: SatelliteMaterials): Group => {
  const lab = new Group();
  lab.add(
    createBox(RACK, materials.whitePaint),
    createFront(materials),
    createMicroscope(materials),
  );
  lab.position.y = -MICROSCOPE.pillar / 2;
  const centered = new Group();
  centered.add(lab);
  return centered;
};
