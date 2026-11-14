import { CircleGeometry, Group, Mesh, MeshStandardMaterial, RingGeometry } from 'three';

const PAD_RADIUS_M = 6;
const MARK_WIDTH_M = 0.4;
const SEGMENTS = 48;
const LIFT_M = 0.02;
const CONCRETE = 0x55575c;
const MARKING = 0xf2c230;

/** A flat round landing pad with a yellow ring, for landers to touch down near the base. */
export const createLandingPad = () => {
  const slab = new Mesh(
    new CircleGeometry(PAD_RADIUS_M, SEGMENTS),
    new MeshStandardMaterial({ color: CONCRETE, roughness: 0.9 }),
  );
  const ring = new Mesh(
    new RingGeometry(PAD_RADIUS_M * 0.6, PAD_RADIUS_M * 0.6 + MARK_WIDTH_M, SEGMENTS),
    new MeshStandardMaterial({ color: MARKING, roughness: 0.8 }),
  );
  ring.position.z = LIFT_M;
  const pad = new Group();
  pad.add(slab, ring);
  pad.rotation.x = -Math.PI / 2;
  pad.position.y = LIFT_M;
  return pad;
};
