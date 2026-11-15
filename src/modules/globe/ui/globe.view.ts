import { advanceRotation, INITIAL_ROTATION } from '../core/globe';
import { createBodyLoader } from './bodies/body.catalog';
import { createGlobeControls } from './globe.controls';
import { createStage, fitStageToCanvas } from './globe.stage';
import type { CelestialBody } from '../core/bodies';
import type { Body } from './bodies/body';

export type Globe = {
  show: (body: CelestialBody) => Promise<void>;
};

const MAX_FRAME_SECONDS = 0.1;
const MS_PER_SECOND = 1000;
const READY_CLASS = 'globe--ready';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Renders a slowly turning celestial body on the given canvas, which the user can spin and zoom.
 * The body only moves on user input when the user prefers reduced motion.
 */
export const mountGlobe = (canvas: HTMLCanvasElement): Globe => {
  const stage = createStage(canvas);
  const loadBody = createBodyLoader({ renderer: stage.renderer, sunDirection: stage.sunDirection });
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  const controls = createGlobeControls(stage.camera, canvas, reducedMotion);
  let current: Body | undefined;
  let requested: CelestialBody | undefined;
  let rotation = INITIAL_ROTATION;

  const render = () => {
    current?.update(rotation);
    stage.renderer.render(stage.scene, stage.camera);
  };

  new ResizeObserver(() => {
    fitStageToCanvas(stage);
    render();
  }).observe(canvas);

  if (reducedMotion) {
    controls.addEventListener('change', render);
  } else {
    let previousTime = performance.now();
    const renderFrame = (time: number) => {
      const elapsedSeconds = Math.min((time - previousTime) / MS_PER_SECOND, MAX_FRAME_SECONDS);
      previousTime = time;
      rotation = advanceRotation(rotation, elapsedSeconds);
      controls.update();
      render();
      requestAnimationFrame(renderFrame);
    };
    requestAnimationFrame(renderFrame);
  }

  return {
    show: async (body) => {
      requested = body;
      const next = await loadBody(body);
      if (requested !== body) return;
      if (current) stage.scene.remove(current.root);
      current = next;
      stage.scene.add(next.root);
      canvas.classList.add(READY_CLASS);
      render();
    },
  };
};
