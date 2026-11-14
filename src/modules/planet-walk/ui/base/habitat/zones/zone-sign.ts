import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three';

/** Sign size (m) and the canvas it is drawn on (px). */
const SIGN = { width: 1.7, height: 0.42 };
const CANVAS = { width: 512, height: 128, padding: 24 };
const COLORS = { background: '#0b1638', border: '#4de3ff', text: '#e8eeff' };
const FONT = '600 52px "Space Grotesk", system-ui, sans-serif';
const MIN_FONT_SCALE = 0.55;

const drawSign = (text: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS.width;
  canvas.height = CANVAS.height;
  const context = canvas.getContext('2d');
  if (!context) return canvas;
  context.fillStyle = COLORS.background;
  context.fillRect(0, 0, CANVAS.width, CANVAS.height);
  context.strokeStyle = COLORS.border;
  context.lineWidth = 8;
  context.strokeRect(4, 4, CANVAS.width - 8, CANVAS.height - 8);
  context.font = FONT;
  const room = CANVAS.width - 2 * CANVAS.padding;
  const scale = Math.max(Math.min(room / context.measureText(text).width, 1), MIN_FONT_SCALE);
  context.setTransform(scale, 0, 0, 1, CANVAS.width / 2, CANVAS.height / 2);
  context.fillStyle = COLORS.text;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 0, 0);
  return canvas;
};

/** Builds a lit sign showing the text, facing +z, centered on the origin. */
export const createZoneSign = (text: string) => {
  const texture = new CanvasTexture(drawSign(text));
  texture.colorSpace = SRGBColorSpace;
  return new Mesh(
    new PlaneGeometry(SIGN.width, SIGN.height),
    new MeshBasicMaterial({ map: texture }),
  );
};
