import {
  CanvasTexture,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
} from 'three';

const EXIT_GREEN = '#17a34a';
const ARROW_COLOR = 0x22c55e;
/** The EXIT sign's canvas (px) and its size in the base (m). */
const SIGN_CANVAS = { width: 512, height: 192 };
/** A floor arrow (m): its width and length, and its height, just above the station floors (0.02). */
const ARROW = { width: 0.5, length: 0.6, lift: 0.035 };
/** Distance between two floor arrows (m). */
const ARROW_SPACING = 5.6;

/** Draws the green EXIT sign with its arrow pointing down to the way out, as on emergency exits. */
const paintExit = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.fillStyle = EXIT_GREEN;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = '#ffffff';
  context.lineWidth = 10;
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  context.fillStyle = '#ffffff';
  context.font = '700 110px "Space Grotesk", system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('EXIT ↓', canvas.width / 2, canvas.height / 2 + 6);
};

/** Builds a lit green EXIT sign of the given width (m), facing +z, centered on the origin. */
export const createExitSign = (width = 1.1) => {
  const canvas = document.createElement('canvas');
  canvas.width = SIGN_CANVAS.width;
  canvas.height = SIGN_CANVAS.height;
  paintExit(canvas);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  void document.fonts.load('700 110px "Space Grotesk"').then(() => {
    paintExit(canvas);
    texture.needsUpdate = true;
  });
  const height = (width * SIGN_CANVAS.height) / SIGN_CANVAS.width;
  return new Mesh(
    new PlaneGeometry(width, height),
    new MeshBasicMaterial({ map: texture, side: DoubleSide }),
  );
};

/** One flat arrow drawn on the floor, pointing towards +z. */
const arrowGeometry = (() => {
  const { width, length } = ARROW;
  const shape = new Shape();
  shape.moveTo(0, length / 2);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 5, 0);
  shape.lineTo(width / 5, -length / 2);
  shape.lineTo(-width / 5, -length / 2);
  shape.lineTo(-width / 5, 0);
  shape.lineTo(-width / 2, 0);
  shape.closePath();
  const geometry = new ShapeGeometry(shape);
  // Lies the arrow on the floor: its tip, drawn towards +y, now points towards +z.
  geometry.rotateX(Math.PI / 2);
  return geometry;
})();
const arrowMaterial = new MeshBasicMaterial({
  color: ARROW_COLOR,
  transparent: true,
  opacity: 0.85,
  side: DoubleSide,
});

/** Lays an arrow on the floor at (x, z), pointing in the direction of the given heading. */
const floorArrow = (x: number, z: number, heading: number) => {
  const arrow = new Mesh(arrowGeometry, arrowMaterial);
  arrow.position.set(x, ARROW.lift, z);
  arrow.rotation.y = heading;
  return arrow;
};

/**
 * Lays arrows along a straight line on +z, from one distance to the other (m), pointing the way
 * from the first to the second.
 */
export const arrowsAlong = (from: number, to: number) => {
  const group = new Group();
  const way = Math.sign(to - from);
  const heading = way > 0 ? 0 : Math.PI;
  const count = Math.floor(Math.abs(to - from) / ARROW_SPACING);
  for (let step = 0; step <= count; step += 1)
    group.add(floorArrow(0, from + way * step * ARROW_SPACING, heading));
  return group;
};

/**
 * Lays arrows on a ring of the given radius (m) around the hall's center, all turning towards the
 * doorway at the given angle (0 towards +z, turning towards +x), on both sides.
 */
export const arrowsAround = (radius: number, towards: number) => {
  const group = new Group();
  const steps = 2;
  for (const side of [-1, 1]) {
    for (let step = 1; step <= steps; step += 1) {
      const angle = towards + side * step * (Math.PI / (steps + 1));
      const x = radius * Math.sin(angle);
      const z = radius * Math.cos(angle);
      // Along the ring, back towards the doorway's angle.
      const dx = -side * Math.cos(angle);
      const dz = side * Math.sin(angle);
      group.add(floorArrow(x, z, Math.atan2(dx, dz)));
    }
  }
  return group;
};
