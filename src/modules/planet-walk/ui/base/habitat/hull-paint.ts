const TILE_PIXELS = 256;
const PAINT = '#ecebe6';
const SEAM = 'rgba(70, 72, 78, 0.55)';
const RIVET = 'rgba(90, 92, 98, 0.6)';
const PANELS_ACROSS = 2;
const RIVETS_PER_EDGE = 6;
const STAINS = 40;

const randomFrom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

/** Paints panels of slightly different whites, then dust stains and their seams on top. */
const paintPanels = (context: CanvasRenderingContext2D, random: () => number) => {
  context.fillStyle = PAINT;
  context.fillRect(0, 0, TILE_PIXELS, TILE_PIXELS);
  const panel = TILE_PIXELS / PANELS_ACROSS;
  for (let column = 0; column < PANELS_ACROSS; column++) {
    const shade = Math.round(random() * 14);
    context.fillStyle = `rgba(120, 118, 110, ${shade / 100})`;
    context.fillRect(column * panel, 0, panel, TILE_PIXELS);
  }
  for (let index = 0; index < STAINS; index++) {
    context.fillStyle = `rgba(110, 108, 100, ${0.03 + random() * 0.05})`;
    const [x, y, size] = [random() * TILE_PIXELS, random() * TILE_PIXELS, 6 + random() * 40];
    context.beginPath();
    context.ellipse(x, y, size, size * 0.5, 0, 0, Math.PI * 2);
    context.fill();
  }
};

/** Draws the seams around each panel and a row of rivets along them. */
const drawSeams = (context: CanvasRenderingContext2D) => {
  const panel = TILE_PIXELS / PANELS_ACROSS;
  context.strokeStyle = SEAM;
  context.lineWidth = 3;
  for (let column = 0; column <= PANELS_ACROSS; column++) {
    context.beginPath();
    context.moveTo(column * panel, 0);
    context.lineTo(column * panel, TILE_PIXELS);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(0, 1);
  context.lineTo(TILE_PIXELS, 1);
  context.stroke();
  context.fillStyle = RIVET;
  for (let index = 1; index < RIVETS_PER_EDGE; index++) {
    const along = (index / RIVETS_PER_EDGE) * TILE_PIXELS;
    for (let column = 0; column <= PANELS_ACROSS; column++) {
      context.fillRect(column * panel + 5, along, 3, 3);
      context.fillRect(column * panel - 8, along, 3, 3);
    }
  }
};

/** Draws one tile of hull plating on a new canvas. */
export const drawTile = () => {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_PIXELS;
  canvas.height = TILE_PIXELS;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2D canvas context is not available');
  paintPanels(context, randomFrom(3));
  drawSeams(context);
  return canvas;
};
