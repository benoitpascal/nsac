import { CanvasTexture, SRGBColorSpace } from 'three';

const WIDTH = 512;
const HEIGHT = 256;
const COLUMNS = 12;
const ROWS = 5;
const CELL_GAP = 3;
const PANEL_FRAME = '#c7ccd6';
const CELL_COLOR = '#14245e';
const CELL_HIGHLIGHT = '#2c4aa8';

/**
 * Draws a grid of photovoltaic cells framed by a light metal border.
 */
export const createSolarPanelTexture = (): CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');

  context.fillStyle = PANEL_FRAME;
  context.fillRect(0, 0, WIDTH, HEIGHT);
  const cellWidth = WIDTH / COLUMNS;
  const cellHeight = HEIGHT / ROWS;
  const gradient = context.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, CELL_HIGHLIGHT);
  gradient.addColorStop(1, CELL_COLOR);
  context.fillStyle = gradient;
  for (let column = 0; column < COLUMNS; column++) {
    for (let row = 0; row < ROWS; row++) {
      const x = column * cellWidth + CELL_GAP;
      const y = row * cellHeight + CELL_GAP;
      context.fillRect(x, y, cellWidth - CELL_GAP * 2, cellHeight - CELL_GAP * 2);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};
