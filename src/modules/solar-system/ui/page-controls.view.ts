import { SKY_EVENTS } from '../core/sky-events';
import { createCameraFollow } from './camera-follow';
import { mountEventsList } from './events.view';
import { mountInfo } from './info/info.view';
import { mountNavigation } from './navigation.view';
import { INITIAL_SCALE_MODE } from './nodes/display-scale';
import { mountScaleToggle } from './scale-toggle.view';
import type { ClockView } from './clock.view';
import type { SolarSystemBodies } from './solar-system-bodies.type';
import type { SolarSystemStage } from './solar-system.stage';

export type PageControlElements = {
  overviewButton: HTMLButtonElement;
  eventsToggle: HTMLButtonElement;
  eventsPanel: HTMLElement;
  scaleToggle: HTMLButtonElement;
  infoPanel: HTMLElement;
};

/**
 * Wires the camera navigation, the events list, the scale toggle and the info panel together,
 * and returns what must be refreshed on every frame.
 */
export const mountPageControls = (
  elements: PageControlElements,
  stage: SolarSystemStage,
  solarSystem: SolarSystemBodies,
  clock: ClockView,
  reducedMotion: boolean,
) => {
  const camera = createCameraFollow(stage.camera, stage.controls, reducedMotion);
  const { focusTargets, sun } = solarSystem;
  const info = mountInfo(elements.infoPanel, stage.scene, focusTargets);
  const navigation = mountNavigation(
    focusTargets,
    elements.overviewButton,
    sun.holder,
    camera,
    info.describe,
  );
  mountEventsList(elements.eventsToggle, elements.eventsPanel, SKY_EVENTS, (event) => {
    clock.jumpTo(event.timestamp);
    navigation.flyTo(event.focus);
  });
  mountScaleToggle(elements.scaleToggle, INITIAL_SCALE_MODE, (mode) => {
    solarSystem.setScaleMode(mode);
    navigation.setScaleMode(mode);
  });
  return { camera, info, navigation };
};
