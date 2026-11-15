import { Mesh, Path, Shape, ShapeGeometry } from 'three';
import { HATCH, MODULE, MODULE_CORNER } from './habitat-dimensions';
import type { MeshStandardMaterial } from 'three';

const SIDES = 8;
/** Turns the octagon so that a flat side lies on the floor. */
const FLAT_FLOOR = Math.PI / SIDES;

/** An end of the module, or a wall across it: an octagon, with the hatch cut out when asked. */
export const bulkhead = (material: MeshStandardMaterial, withHatch: boolean) => {
  const corners = Array.from({ length: SIDES }, (_, index) => {
    const angle = FLAT_FLOOR + (index * 2 * Math.PI) / SIDES;
    return [Math.cos(angle) * MODULE_CORNER, Math.sin(angle) * MODULE_CORNER] as const;
  });
  const shape = new Shape().moveTo(...corners[0]);
  for (const corner of corners.slice(1)) shape.lineTo(...corner);
  shape.closePath();
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
  return new Mesh(new ShapeGeometry(shape), material);
};
