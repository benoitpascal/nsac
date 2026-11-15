import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Camera } from 'three';

const MIN_DISTANCE = 1.6;
const MAX_DISTANCE = 6;
const ROTATE_SPEED = 0.5;
const ZOOM_SPEED = 0.6;
const DAMPING_FACTOR = 0.08;

/**
 * Lets the user spin the camera around the globe by dragging and zoom with the wheel or a pinch.
 * Inertia is disabled when the user prefers reduced motion.
 */
export const createGlobeControls = (
  camera: Camera,
  canvas: HTMLCanvasElement,
  reducedMotion: boolean,
): OrbitControls => {
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.minDistance = MIN_DISTANCE;
  controls.maxDistance = MAX_DISTANCE;
  controls.rotateSpeed = ROTATE_SPEED;
  controls.zoomSpeed = ZOOM_SPEED;
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = DAMPING_FACTOR;
  return controls;
};
