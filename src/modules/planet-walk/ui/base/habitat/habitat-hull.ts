import {
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Path,
  Shape,
  ShapeGeometry,
  TorusGeometry,
} from 'three';
import { HATCH, MODULE } from './habitat-dimensions';
import { hatchFrame, lightStrips, windows } from './habitat-hull-details';
import type { ModuleEnds } from './habitat-dimensions';

const SEGMENTS = 48;
const HULL_COLOR = 0xeeeeea;
const RIB_COLOR = 0xb8bec9;
const RIB_SPACING_M = 2;
/** How far a hatch frame stands out from the end it surrounds (m). */
const FRAME_OFFSET = 0.06;

/** An end of the module, or a wall across it: a disc, with the hatch cut out when asked. */
export const bulkhead = (material: MeshStandardMaterial, withHatch: boolean) => {
  const shape = new Shape().absarc(0, 0, MODULE.radius, 0, Math.PI * 2, false);
  if (withHatch) {
    const [half, floor] = [HATCH.width / 2, -MODULE.axisHeight];
    const hatch = new Path().moveTo(-half, floor).lineTo(-half, floor + HATCH.height);
    shape.holes.push(
      hatch
        .lineTo(half, floor + HATCH.height)
        .lineTo(half, floor)
        .closePath(),
    );
  }
  return new Mesh(new ShapeGeometry(shape, SEGMENTS), material);
};

/**
 * Builds the white hull of a habitat module of the given length (m): a cylinder lying along z with
 * reinforcing rings, glowing windows, and ends closed or opened by a framed hatch, its axis at the
 * origin.
 */
export const createHabitatHull = (ends: ModuleEnds, length: number) => {
  const front = length / 2;
  const hullMaterial = new MeshStandardMaterial({
    color: HULL_COLOR,
    roughness: 0.6,
    side: DoubleSide,
  });
  const ribMaterial = new MeshStandardMaterial({
    color: RIB_COLOR,
    metalness: 0.6,
    roughness: 0.4,
  });
  const hull = new Mesh(
    new CylinderGeometry(MODULE.radius, MODULE.radius, length, SEGMENTS, 1, true),
    hullMaterial,
  );
  hull.rotation.x = Math.PI / 2;
  const back = bulkhead(hullMaterial, ends.back);
  back.position.z = -front;
  const frontEnd = bulkhead(hullMaterial, ends.front);
  frontEnd.position.z = front;
  const module = new Group();
  module.add(hull, back, frontEnd, windows(length), lightStrips(length));
  if (ends.front) module.add(hatchFrame(front + FRAME_OFFSET));
  if (ends.back) module.add(hatchFrame(-front - FRAME_OFFSET));
  for (let z = -front; z <= front; z += RIB_SPACING_M) {
    const rib = new Mesh(new TorusGeometry(MODULE.radius + 0.04, 0.07, 8, SEGMENTS), ribMaterial);
    rib.position.z = z;
    module.add(rib);
  }
  return module;
};
