/** The canvas a sign is drawn on (px): twice the old size, so that it stays sharp up close. */
export const CANVAS = { width: 1024, height: 256, padding: 44 };
const COLORS = { background: '#0b1638', border: '#4de3ff', text: '#e8eeff', accent: '#4de3ff' };
const FAMILY = '"Space Grotesk", system-ui, sans-serif';
/** Font sizes (px): the main line at most, the smallest it may shrink to, and the second line. */
const SIZE = { main: 104, smallest: 56, sub: 58 };

/**
 * What a sign says: a room number in a badge then its name ("12 · Storage"), or a wing's name over
 * the rooms it holds ("Workshops & supplies · 8 to 12"), or just a word.
 */
const readSign = (text: string) => {
  const room = /^(\d+) · (.+)$/.exec(text);
  if (room) return { badge: room[1], main: room[2], sub: '' };
  const wing = /^(.+) · (\d+ to \d+)$/.exec(text);
  if (wing) return { badge: '', main: wing[1], sub: `Rooms ${wing[2]}` };
  return { badge: '', main: text, sub: '' };
};

/** Picks the largest font size, up to the main size, at which the text fits the room (px). */
const fitFont = (context: CanvasRenderingContext2D, text: string, room: number) => {
  let size = SIZE.main;
  context.font = `700 ${size}px ${FAMILY}`;
  while (size > SIZE.smallest && context.measureText(text).width > room) {
    size -= 4;
    context.font = `700 ${size}px ${FAMILY}`;
  }
  return size;
};

/** Draws the room number in a round cyan badge at the left, and returns how wide it is (px). */
const drawBadge = (context: CanvasRenderingContext2D, badge: string) => {
  if (!badge) return 0;
  const radius = 72;
  const x = CANVAS.padding + radius;
  context.fillStyle = COLORS.accent;
  context.beginPath();
  context.arc(x, CANVAS.height / 2, radius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = COLORS.background;
  context.font = `700 ${badge.length > 1 ? 80 : 96}px ${FAMILY}`;
  context.fillText(badge, x, CANVAS.height / 2 + 4);
  return 2 * radius + 28;
};

/** Paints the sign on the canvas: dark panel, cyan frame, badge, main line and second line. */
export const paintSign = (canvas: HTMLCanvasElement, text: string) => {
  const context = canvas.getContext('2d');
  if (!context) return;
  const { badge, main, sub } = readSign(text);
  context.fillStyle = COLORS.background;
  context.fillRect(0, 0, CANVAS.width, CANVAS.height);
  context.strokeStyle = COLORS.border;
  context.lineWidth = 12;
  context.strokeRect(6, 6, CANVAS.width - 12, CANVAS.height - 12);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const left = drawBadge(context, badge);
  const room = CANVAS.width - 2 * CANVAS.padding - left;
  const middle = CANVAS.padding + left + room / 2;
  const size = fitFont(context, main, room);
  context.fillStyle = COLORS.text;
  context.fillText(main, middle, sub ? CANVAS.height * 0.38 : CANVAS.height / 2 + 4, room);
  if (!sub) return;
  context.font = `500 ${Math.min(SIZE.sub, size * 0.65)}px ${FAMILY}`;
  context.fillStyle = COLORS.accent;
  context.fillText(sub, middle, CANVAS.height * 0.74, room);
};
