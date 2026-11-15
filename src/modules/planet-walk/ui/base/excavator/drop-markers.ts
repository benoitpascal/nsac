import {
  AdditiveBlending,
  CylinderGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
} from 'three';

/** Red, like the drop-off zone on the map and in the goals. */
const RED = 0xed5f79;
const POLE_COLOR = 0x9aa1ad;

/** A red light on a pole at each corner, seen from the dig site and at night (m). */
const BEACON = { height: 2.5, radius: 0.05, light: 0.3 };
/** A faint red light beam rising over the zone, to find it from the dig site (m). */
const BEAM = { radius: 0.8, height: 14, opacity: 0.35 };

export const lightBeam = (x: number, z: number, color: number = RED) => {
  const beam = new Mesh(
    new CylinderGeometry(BEAM.radius * 0.6, BEAM.radius, BEAM.height, 24, 1, true),
    new MeshBasicMaterial({
      color,
      transparent: true,
      opacity: BEAM.opacity,
      blending: AdditiveBlending,
      depthWrite: false,
    }),
  );
  beam.position.set(x, BEAM.height / 2, z);
  return beam;
};

export const beacon = (x: number, z: number) => {
  const pole = new Mesh(
    new CylinderGeometry(BEACON.radius, BEACON.radius, BEACON.height, 8),
    new MeshStandardMaterial({ color: POLE_COLOR, metalness: 0.6, roughness: 0.4 }),
  );
  pole.position.set(x, BEACON.height / 2, z);
  const light = new Mesh(
    new SphereGeometry(BEACON.light, 16, 12),
    new MeshStandardMaterial({ color: RED, emissive: RED, emissiveIntensity: 2 }),
  );
  light.position.set(x, BEACON.height + BEACON.light, z);
  return [pole, light];
};
