import { CircleGeometry, Group, Mesh } from 'three';
import { createBox, createCylinder, QUARTER_TURN, ROUND_SEGMENTS } from '../satellite.shapes';
import type { Material } from 'three';
import type { SatelliteMaterials } from '../satellite.materials';

const TUBE = { radius: 0.22, length: 0.9, centerX: 0.25 };
const AFT = { radius: 0.25, length: 0.4 };
const DOOR = { thickness: 0.015, openAngle: 2 };
const BOOM = { radius: 0.012, length: 0.1 };
const PANEL = { length: 0.75, thickness: 0.012, width: 0.22, offsetX: 0.05 };

const tubeFrontX = TUBE.centerX + TUBE.length / 2;
const tubeBackX = TUBE.centerX - TUBE.length / 2;

const createHorizontalCylinder = (
  radius: number,
  length: number,
  centerX: number,
  material: Material,
) => {
  const cylinder = createCylinder(radius, length, 'x', material);
  cylinder.position.x = centerX;
  return cylinder;
};

const createApertureDoor = (materials: SatelliteMaterials) => {
  const hinge = new Group();
  hinge.position.set(tubeFrontX, TUBE.radius, 0);
  const door = createHorizontalCylinder(TUBE.radius, DOOR.thickness, 0, materials.silverFoil);
  door.position.y = -TUBE.radius;
  hinge.add(door);
  hinge.rotation.z = DOOR.openAngle;
  return hinge;
};

const createSolarArray = (side: 1 | -1, materials: SatelliteMaterials) => {
  const boom = createCylinder(BOOM.radius, BOOM.length, 'z', materials.metal);
  boom.position.set(PANEL.offsetX, 0, side * (TUBE.radius + BOOM.length / 2));
  const panelSize = { x: PANEL.length, y: PANEL.thickness, z: PANEL.width };
  const panel = createBox(panelSize, materials.panel);
  panel.position.set(PANEL.offsetX, 0, side * (TUBE.radius + BOOM.length + PANEL.width / 2));
  const array = new Group();
  array.add(boom, panel);
  return array;
};

/**
 * Assembles a space telescope: a foil-wrapped tube with an open aperture door,
 * a wider equipment section at the back and two solar arrays.
 */
export const assembleSpaceTelescope = (materials: SatelliteMaterials): Group => {
  const tube = createHorizontalCylinder(
    TUBE.radius,
    TUBE.length,
    TUBE.centerX,
    materials.silverFoil,
  );
  const aft = createHorizontalCylinder(
    AFT.radius,
    AFT.length,
    tubeBackX - AFT.length / 2,
    materials.silverFoil,
  );
  const aperture = new Mesh(
    new CircleGeometry(TUBE.radius * 0.92, ROUND_SEGMENTS),
    materials.aperture,
  );
  aperture.rotation.y = QUARTER_TURN;
  aperture.position.x = tubeFrontX + 0.001;
  const telescope = new Group();
  telescope.add(tube, aft, aperture, createApertureDoor(materials));
  telescope.add(createSolarArray(1, materials), createSolarArray(-1, materials));
  telescope.position.x = -(tubeFrontX + tubeBackX - AFT.length) / 2;
  const centered = new Group();
  centered.add(telescope);
  return centered;
};
