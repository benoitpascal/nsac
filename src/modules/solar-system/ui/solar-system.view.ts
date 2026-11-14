import { mountClock } from './clock.view';
import { mountPageControls } from './page-controls.view';
import { createStarSky } from './nodes/star-sky.mesh';
import { loadSolarSystemBodies } from './solar-system.bodies';
import { createSolarSystemStage, fitSolarSystemStage } from './solar-system.stage';
import type { PageControlElements } from './page-controls.view';
import type { Star } from '../core/star';
import type { Ephemeris } from '../core/spacecraft/ephemeris';
import { advanceRotation, INITIAL_ROTATION } from '@/modules/globe/core/globe';

export type SolarSystemElements = PageControlElements & {
  canvas: HTMLCanvasElement;
  labelLayer: HTMLElement;
  timePanel: HTMLElement;
  speedPicker: HTMLElement;
  loadStars: () => Promise<Star[]>;
  loadTrajectories: () => Promise<Ephemeris[]>;
};

const MAX_FRAME_SECONDS = 0.1;
const MS_PER_SECOND = 1000;
const READY_CLASS = 'solar-system--ready';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Renders the Sun, the planets and the Moon where they are on the simulated date, starting today,
 * in front of the real stars.
 * The user picks how fast and which way time flows, jumps to any date or listed event,
 * flies to any body and asks for facts about it.
 * Planets start frozen and do not spin when the user prefers reduced motion.
 */
export const mountSolarSystem = async (elements: SolarSystemElements) => {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  const stage = createSolarSystemStage(elements.canvas, elements.labelLayer, reducedMotion);
  const clock = mountClock(elements.timePanel, elements.speedPicker, reducedMotion);
  let rotation = INITIAL_ROTATION;

  const solarSystem = await loadSolarSystemBodies(
    stage.renderer,
    clock.current().timestamp,
    elements.loadTrajectories(),
  );
  stage.scene.add(solarSystem.sun.holder);
  for (const planet of solarSystem.planets) stage.scene.add(planet.holder, planet.orbitLine);
  stage.scene.add(solarSystem.spacecraft.solarSystemGroup);
  const sky = createStarSky(await elements.loadStars());
  stage.scene.add(sky);
  const { camera, info, navigation } = mountPageControls(
    elements,
    stage,
    solarSystem,
    clock,
    reducedMotion,
  );

  new ResizeObserver(() => fitSolarSystemStage(stage)).observe(elements.canvas);
  fitSolarSystemStage(stage);
  elements.canvas.classList.add(READY_CLASS);

  let previousTime = performance.now();
  const renderFrame = (time: number) => {
    const elapsedSeconds = Math.min((time - previousTime) / MS_PER_SECOND, MAX_FRAME_SECONDS);
    previousTime = time;
    const simulatedMs = clock.tick(elapsedSeconds);
    if (!reducedMotion) rotation = advanceRotation(rotation, elapsedSeconds);
    const now = clock.current();
    solarSystem.placeAt(now.timestamp);
    const tick = { clock: now, simulatedMs, cloudsOffset: rotation.cloudsOffset };
    for (const spin of solarSystem.spinners) spin(tick);
    solarSystem.spacecraft.update(now.timestamp, simulatedMs, stage.camera);
    navigation.update();
    info.update(now.timestamp, elapsedSeconds);
    camera.update(elapsedSeconds);
    stage.controls.update();
    sky.position.copy(stage.camera.position);
    stage.renderer.render(stage.scene, stage.camera);
    stage.labels.render(stage.scene, stage.camera);
    requestAnimationFrame(renderFrame);
  };
  requestAnimationFrame(renderFrame);
};
