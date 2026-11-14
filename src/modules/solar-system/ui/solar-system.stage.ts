import { AmbientLight, PerspectiveCamera, PointLight, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { INITIAL_SCALE_MODE, OVERVIEW } from './nodes/display-scale';

export type SolarSystemStage = {
  renderer: WebGLRenderer;
  labels: CSS2DRenderer;
  camera: PerspectiveCamera;
  scene: Scene;
  controls: OrbitControls;
};

const CAMERA_FIELD_OF_VIEW = 45;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 5000;
const CAMERA_START_DIRECTION = new Vector3(0, 2, 3).normalize();
const MAX_PIXEL_RATIO = 2;
const SUNLIGHT_INTENSITY = 2.6;
const STARLIGHT_INTENSITY = 0.08;
const DAMPING_FACTOR = 0.08;

const createControls = (
  camera: PerspectiveCamera,
  canvas: HTMLCanvasElement,
  reducedMotion: boolean,
) => {
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.minDistance = OVERVIEW[INITIAL_SCALE_MODE].minDistance;
  controls.maxDistance = OVERVIEW[INITIAL_SCALE_MODE].maxDistance;
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = DAMPING_FACTOR;
  return controls;
};

/**
 * Creates the renderer drawing on the given canvas, the label layer inside the given container,
 * a camera the user can spin and zoom around the Sun, and a scene lit from the Sun.
 */
export const createSolarSystemStage = (
  canvas: HTMLCanvasElement,
  labelLayer: HTMLElement,
  reducedMotion: boolean,
): SolarSystemStage => {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  const labels = new CSS2DRenderer({ element: labelLayer });
  const camera = new PerspectiveCamera(CAMERA_FIELD_OF_VIEW, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position
    .copy(CAMERA_START_DIRECTION)
    .multiplyScalar(OVERVIEW[INITIAL_SCALE_MODE].distance);
  const sunlight = new PointLight(0xffffff, SUNLIGHT_INTENSITY, 0, 0);
  const scene = new Scene();
  scene.add(sunlight, new AmbientLight(0xffffff, STARLIGHT_INTENSITY));
  return {
    renderer,
    labels,
    camera,
    scene,
    controls: createControls(camera, canvas, reducedMotion),
  };
};

/** Matches the drawing buffer, label layer and camera aspect to the canvas size on screen. */
export const fitSolarSystemStage = ({ renderer, labels, camera }: SolarSystemStage) => {
  const { clientWidth, clientHeight } = renderer.domElement;
  renderer.setSize(clientWidth, clientHeight, false);
  labels.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
};
