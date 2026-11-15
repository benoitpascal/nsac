import { BoxGeometry, CircleGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial } from 'three';
import { HATCH, MODULE } from './habitat-dimensions';

const FRAME_COLOR = 0xff6b3d;
const WINDOW_GLOW = 0xffd28a;
const WINDOW = { radius: 0.25, spacing: 2, height: 0.4 };
/** Amber marker lights running along both shoulders of the hull, so that it shows in the dark. */
const STRIP = { color: 0xff6a10, angle: 0.95, width: 0.09, thickness: 0.04, glow: 1.3, gapM: 0.5 };

/** Glowing round windows along both sides of a hull of the given length (m). */
export const windows = (length: number) => {
  const front = length / 2;
  const glow = new MeshStandardMaterial({
    color: WINDOW_GLOW,
    emissive: WINDOW_GLOW,
    emissiveIntensity: 1.2,
    side: DoubleSide,
  });
  const row = new Group();
  for (let z = -front + WINDOW.spacing; z < front; z += WINDOW.spacing) {
    for (const side of [-1, 1]) {
      const pane = new Mesh(new CircleGeometry(WINDOW.radius, 24), glow);
      pane.position.set(side * (MODULE.radius + 0.02), WINDOW.height, z);
      pane.rotation.y = (side * Math.PI) / 2;
      row.add(pane);
    }
  }
  return row;
};

/** An orange frame around a hatch: two posts and a lintel, across z at the given place (m). */
export const hatchFrame = (z: number) => {
  const material = new MeshStandardMaterial({ color: FRAME_COLOR, roughness: 0.6 });
  const [half, floor, bar] = [HATCH.width / 2, -MODULE.axisHeight, 0.12];
  const post = () => new Mesh(new BoxGeometry(bar, HATCH.height, bar), material);
  const [left, right] = [post(), post()];
  left.position.set(-half - bar / 2, floor + HATCH.height / 2, 0);
  right.position.set(half + bar / 2, floor + HATCH.height / 2, 0);
  const lintel = new Mesh(new BoxGeometry(HATCH.width + 2 * bar, bar, bar), material);
  lintel.position.set(0, floor + HATCH.height + bar / 2, 0);
  const frame = new Group();
  frame.add(left, right, lintel);
  frame.position.z = z;
  return frame;
};

/** Glowing amber strips along both upper sides of a hull of the given length (m). */
export const lightStrips = (length: number) => {
  const glow = new MeshStandardMaterial({
    color: STRIP.color,
    emissive: STRIP.color,
    emissiveIntensity: STRIP.glow,
  });
  const strips = new Group();
  for (const side of [-1, 1]) {
    const strip = new Mesh(
      new BoxGeometry(STRIP.width, STRIP.thickness, length - 2 * STRIP.gapM),
      glow,
    );
    const angle = side * STRIP.angle;
    const radius = MODULE.radius + STRIP.thickness / 2;
    strip.position.set(Math.sin(angle) * radius, Math.cos(angle) * radius, 0);
    strip.rotation.z = -angle;
    strips.add(strip);
  }
  return strips;
};
