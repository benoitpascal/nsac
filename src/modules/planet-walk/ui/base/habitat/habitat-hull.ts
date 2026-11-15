import {
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
} from 'three';
import { MODULE_CORNER } from './habitat-dimensions';
import { bulkhead } from './bulkhead';
import { hullPlating } from './hull-texture';
import { hatchFrame, lightStrips, windows } from './habitat-hull-details';
import type { ModuleEnds } from './habitat-dimensions';

const SIDES = 8;
/** Turns the octagon so that a flat side lies on the floor. */
const FLAT_FLOOR = Math.PI / SIDES;
const RIB_COLOR = 0x5d626c;
const RIB_SPACING_M = 4;
/** Length (m) of hull covered by one tile of plating. */
const PLATING_M = 2;
/** How far a hatch frame stands out from the end it surrounds (m). */
const FRAME_OFFSET = 0.06;

/**
 * Builds the white plated hull of a habitat module of the given length (m): an octagonal tube lying
 * along z with reinforcing frames, glowing windows, and ends closed or opened by a framed hatch, its axis at the
 * origin.
 */
export const createHabitatHull = (ends: ModuleEnds, length: number) => {
  const front = length / 2;
  const hullMaterial = new MeshStandardMaterial({
    ...hullPlating(SIDES, length / PLATING_M),
    bumpScale: 0.6,
    roughness: 0.6,
    side: DoubleSide,
  });
  const endMaterial = new MeshStandardMaterial({
    ...hullPlating(1, 1),
    bumpScale: 0.6,
    roughness: 0.6,
    side: DoubleSide,
  });
  const ribMaterial = new MeshStandardMaterial({
    color: RIB_COLOR,
    metalness: 0.6,
    roughness: 0.4,
  });
  const hull = new Mesh(
    new CylinderGeometry(MODULE_CORNER, MODULE_CORNER, length, SIDES, 1, true, FLAT_FLOOR),
    hullMaterial,
  );
  hull.rotation.x = Math.PI / 2;
  const back = bulkhead(endMaterial, ends.back);
  back.position.z = -front;
  const frontEnd = bulkhead(endMaterial, ends.front);
  frontEnd.position.z = front;
  const module = new Group();
  module.add(hull, back, frontEnd, windows(length), lightStrips(length));
  if (ends.front) module.add(hatchFrame(front + FRAME_OFFSET));
  if (ends.back) module.add(hatchFrame(-front - FRAME_OFFSET));
  for (let z = -front; z <= front; z += RIB_SPACING_M) {
    const rib = new Mesh(new TorusGeometry(MODULE_CORNER + 0.03, 0.08, 6, SIDES), ribMaterial);
    rib.rotation.z = FLAT_FLOOR;
    rib.position.z = z;
    module.add(rib);
  }
  return module;
};
