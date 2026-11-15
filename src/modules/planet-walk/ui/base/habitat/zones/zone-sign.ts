import {
  BoxGeometry,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three';
import { CANVAS, paintSign } from './sign-canvas';

/** Sign size (m), and the metal plate it is mounted on. */
const SIGN = { width: 1.9, plate: 0.06, depth: 0.05 };
const FONT_TO_WAIT_FOR = '700 104px "Space Grotesk"';

/**
 * Builds a lit sign showing the text, of the given width (m), facing +z, centered on the origin: a
 * sharp printed face on a dark metal plate. The text is drawn again once the page's font has loaded.
 */
export const createZoneSign = (text: string, width = SIGN.width) => {
  const height = (width * CANVAS.height) / CANVAS.width;
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS.width;
  canvas.height = CANVAS.height;
  paintSign(canvas, text);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  void document.fonts.load(FONT_TO_WAIT_FOR).then(() => {
    paintSign(canvas, text);
    texture.needsUpdate = true;
  });
  const face = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({ map: texture }));
  face.position.z = SIGN.depth / 2 + 0.002;
  const plate = new Mesh(
    new BoxGeometry(width + SIGN.plate, height + SIGN.plate, SIGN.depth),
    new MeshStandardMaterial({ color: 0x2a2f38, metalness: 0.6, roughness: 0.45 }),
  );
  const sign = new Group();
  sign.add(plate, face);
  return sign;
};
