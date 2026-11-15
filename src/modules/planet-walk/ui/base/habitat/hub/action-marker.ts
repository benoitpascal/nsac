import { Mesh, MeshStandardMaterial, OctahedronGeometry, PointLight } from 'three';

const COLOR = 0xa020ff;
/** The prism's half height and half width (m), and how far above the floor it floats. */
const PRISM = { halfHeight: 0.28, halfWidth: 0.16, height: 2.3 };
/** The light it sheds around itself, so that it glows on the walls and the desk. */
const HALO = { intensity: 2, distance: 3 };
/** One turn every this many milliseconds, and a slow bob up and down. */
const SPIN = { periodMs: 4000, bobM: 0.06 };

/** Every marker of the base, turned together by spinActionMarkers. */
const markers: Mesh[] = [];

/**
 * Creates the glowing prism that floats above where the next action happens (the station
 * terminal), turning slowly so that it can be spotted from afar.
 */
export const createActionMarker = () => {
  const geometry = new OctahedronGeometry(1, 0);
  geometry.scale(PRISM.halfWidth, PRISM.halfHeight, PRISM.halfWidth);
  const marker = new Mesh(
    geometry,
    new MeshStandardMaterial({
      color: COLOR,
      emissive: COLOR,
      emissiveIntensity: 0.9,
      flatShading: true,
    }),
  );
  marker.position.y = PRISM.height;
  marker.add(new PointLight(COLOR, HALO.intensity, HALO.distance));
  markers.push(marker);
  return marker;
};

/** Turns every action marker at that moment of the page (ms, as from performance.now()). */
export const spinActionMarkers = (now: number) => {
  const turn = (now % SPIN.periodMs) / SPIN.periodMs;
  for (const marker of markers) {
    marker.rotation.y = turn * 2 * Math.PI;
    marker.position.y = PRISM.height + Math.sin(turn * 2 * Math.PI) * SPIN.bobM;
  }
};
