import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { formatDistance } from './info-format';
import type { Object3D, Scene } from 'three';

export type GuideTarget = {
  object: Object3D;
  distanceFromSunKm?: number;
  distanceFromEarthKm?: number;
};

const SUN_GUIDE_COLOR = 0xffb347;
const EARTH_GUIDE_COLOR = 0x4de3ff;
const GUIDE_OPACITY = 0.7;
const LABEL_CLASS = 'info-guide-label';

const createGuide = (scene: Scene, color: number) => {
  const line = new Line(
    new BufferGeometry(),
    new LineBasicMaterial({ color, transparent: true, opacity: GUIDE_OPACITY }),
  );
  const element = document.createElement('span');
  element.className = LABEL_CLASS;
  const label = new CSS2DObject(element);
  scene.add(line, label);
  const start = new Vector3();
  const end = new Vector3();
  return (from: Object3D | undefined, to: Object3D | undefined, distanceKm: number | undefined) => {
    const visible = from !== undefined && to !== undefined && distanceKm !== undefined;
    line.visible = visible;
    label.visible = visible;
    if (!visible) return;
    from.getWorldPosition(start);
    to.getWorldPosition(end);
    line.geometry.setFromPoints([start, end]);
    label.position.lerpVectors(start, end, 0.5);
    element.textContent = formatDistance(distanceKm);
  };
};

/**
 * Adds the guide lines drawn from the Sun and from the Earth to the body being described,
 * each labelled with the real distance. Updating with no target hides them.
 */
export const createInfoGuides = (scene: Scene, sun: Object3D, earth: Object3D) => {
  const fromSun = createGuide(scene, SUN_GUIDE_COLOR);
  const fromEarth = createGuide(scene, EARTH_GUIDE_COLOR);
  return (target: GuideTarget | undefined) => {
    fromSun(sun, target?.object, target?.distanceFromSunKm);
    fromEarth(earth, target?.object, target?.distanceFromEarthKm);
  };
};
