import { INITIAL_SCALE_MODE, OVERVIEW } from './nodes/display-scale';
import { focusIdOf } from './nodes/focus-target';
import type { CameraFollow } from './camera-follow';
import type { ScaleMode } from './nodes/display-scale';
import type { FocusTarget } from './nodes/focus-target';
import type { FocusId } from '../core/spacecraft/spacecraft-ids';
import type { Object3D } from 'three';

const VIEW_DISTANCE_IN_RADII = 6;
const MIN_DISTANCE_IN_RADII = 1.6;

export type Navigation = {
  /** Flies the camera to the given body or spacecraft, if it is there. */
  flyTo: (id: FocusId) => void;
  /** Flies back to its home body when the followed spacecraft is no longer shown. */
  update: () => void;
  /** Flies again to the followed body, or to the whole solar system, at the given scale. */
  setScaleMode: (mode: ScaleMode) => void;
};

/**
 * Flies the camera to a body or spacecraft when its name is clicked, and back to the whole solar system
 * (centered on the given object) with the overview button or the Escape key.
 * Reports the followed body (none on the overview) each time it changes.
 */
export const mountNavigation = (
  targets: FocusTarget[],
  overviewButton: HTMLButtonElement,
  center: Object3D,
  camera: CameraFollow,
  onFollow: (target: FocusTarget | undefined) => void,
): Navigation => {
  let followed: FocusTarget | undefined;
  const find = (id: FocusId) => targets.find((candidate) => focusIdOf(candidate) === id);
  let overview = OVERVIEW[INITIAL_SCALE_MODE];
  const flyToTarget = (target: FocusTarget) => {
    followed = target;
    onFollow(target);
    camera.flyTo(
      target.object,
      target.radius * VIEW_DISTANCE_IN_RADII,
      target.radius * MIN_DISTANCE_IN_RADII,
      target.kind === 'spacecraft' ? find(target.home)?.object : undefined,
    );
  };
  for (const target of targets) {
    target.label.addEventListener('click', () => flyToTarget(target));
  }
  const showOverview = () => {
    followed = undefined;
    onFollow(undefined);
    camera.flyTo(center, overview.distance, overview.minDistance);
  };
  const flyToId = (id: FocusId) => {
    const target = find(id);
    if (target) flyToTarget(target);
  };
  overviewButton.addEventListener('click', showOverview);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') showOverview();
  });
  return {
    flyTo: (id) => flyToId(id),
    update: () => {
      if (followed?.kind === 'spacecraft' && !followed.isShown()) flyToId(followed.home);
    },
    setScaleMode: (mode) => {
      overview = OVERVIEW[mode];
      camera.setMaxDistance(overview.maxDistance);
      if (followed) flyToTarget(followed);
      else showOverview();
    },
  };
};
