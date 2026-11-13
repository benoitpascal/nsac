import { advanceStar, createStarfield, starOpacity } from '../core/starfield';
import type { FieldSize, Star } from '../core/starfield';

const STAR_COLOR = '220, 232, 255';
const FULL_TURN = Math.PI * 2;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const readViewportSize = (): FieldSize => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const drawStars = (context: CanvasRenderingContext2D, stars: Star[], size: FieldSize) => {
  context.clearRect(0, 0, size.width, size.height);
  for (const star of stars) {
    context.beginPath();
    context.fillStyle = `rgba(${STAR_COLOR}, ${starOpacity(star)})`;
    context.arc(star.x, star.y, star.radius, 0, FULL_TURN);
    context.fill();
  }
};

const fitCanvasToViewport = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
  const size = readViewportSize();
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = size.width * pixelRatio;
  canvas.height = size.height * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return size;
};

/**
 * Renders an animated star field filling the viewport on the given canvas.
 * The field stays still when the user prefers reduced motion.
 */
export const mountStarfield = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');
  if (!context) return;

  let size = fitCanvasToViewport(canvas, context);
  let stars = createStarfield(size);

  window.addEventListener('resize', () => {
    size = fitCanvasToViewport(canvas, context);
    stars = createStarfield(size);
    drawStars(context, stars, size);
  });

  const renderFrame = () => {
    stars = stars.map((star) => advanceStar(star, size));
    drawStars(context, stars, size);
    requestAnimationFrame(renderFrame);
  };

  drawStars(context, stars, size);
  if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) requestAnimationFrame(renderFrame);
};
