import { BoxGeometry, CylinderGeometry, Group, Mesh, SphereGeometry } from 'three';
import type { SatelliteMaterials } from './satellite.materials';
import type { Material } from 'three';

export type Axis = 'x' | 'y' | 'z';

export type Size = {
  x: number;
  y: number;
  z: number;
};

export type SolarWing = {
  side: 1 | -1;
  from: number;
  boomLength: number;
  panelLength: number;
  panelWidth: number;
};

export const ROUND_SEGMENTS = 48;
export const QUARTER_TURN = Math.PI / 2;
export const ROD_RADIUS = 0.015;
const PANEL_THICKNESS = 0.02;
const DISH_RINGS = 12;

/** Creates a box of the given size, centered on the origin. */
export const createBox = (size: Size, material: Material) =>
  new Mesh(new BoxGeometry(size.x, size.y, size.z), material);

/** Creates a cylinder lying along the given axis, centered on the origin. */
export const createCylinder = (
  radius: number,
  length: number,
  axis: Axis,
  material: Material,
  segments = ROUND_SEGMENTS,
) => {
  const cylinder = new Mesh(new CylinderGeometry(radius, radius, length, segments), material);
  if (axis === 'x') cylinder.rotation.z = QUARTER_TURN;
  if (axis === 'z') cylinder.rotation.x = QUARTER_TURN;
  return cylinder;
};

/** Creates a concave dish opening upwards, with its vertex at the origin. */
export const createDish = (radius: number, opening: number, material: Material) => {
  const geometry = new SphereGeometry(
    radius,
    ROUND_SEGMENTS,
    DISH_RINGS,
    0,
    Math.PI * 2,
    0,
    opening,
  );
  const dish = new Mesh(geometry, material);
  dish.rotation.x = Math.PI;
  dish.position.y = radius;
  const holder = new Group();
  holder.add(dish);
  return holder;
};

/** Creates a solar wing along the x axis: a boom leaving the bus edge, then a flat panel. */
export const createSolarWing = (wing: SolarWing, materials: SatelliteMaterials) => {
  const boom = createCylinder(ROD_RADIUS, wing.boomLength, 'x', materials.metal);
  boom.position.x = wing.side * (wing.from + wing.boomLength / 2);
  const panelSize = { x: wing.panelLength, y: PANEL_THICKNESS, z: wing.panelWidth };
  const panel = createBox(panelSize, materials.panel);
  panel.position.x = wing.side * (wing.from + wing.boomLength + wing.panelLength / 2);
  const group = new Group();
  group.add(boom, panel);
  return group;
};
