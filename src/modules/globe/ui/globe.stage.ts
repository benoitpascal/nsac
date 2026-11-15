import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { SUN_DIRECTION } from '../core/globe';

export type Stage = {
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  scene: Scene;
  sunDirection: Vector3;
};

const CAMERA_FIELD_OF_VIEW = 35;
const CAMERA_DISTANCE = 3.9;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;
const MAX_PIXEL_RATIO = 2;
const SUN_INTENSITY = 3;
const SUN_DISTANCE = 10;
const STARLIGHT_INTENSITY = 0.04;

/**
 * Creates the renderer, camera and sunlit scene drawing on the given canvas.
 */
export const createStage = (canvas: HTMLCanvasElement): Stage => {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  const camera = new PerspectiveCamera(CAMERA_FIELD_OF_VIEW, 1, CAMERA_NEAR, CAMERA_FAR);
  camera.position.z = CAMERA_DISTANCE;

  const sunDirection = new Vector3(SUN_DIRECTION.x, SUN_DIRECTION.y, SUN_DIRECTION.z);
  const sun = new DirectionalLight(0xffffff, SUN_INTENSITY);
  sun.position.copy(sunDirection).multiplyScalar(SUN_DISTANCE);
  const scene = new Scene();
  scene.add(sun, new AmbientLight(0xffffff, STARLIGHT_INTENSITY));
  return { renderer, camera, scene, sunDirection };
};

/**
 * Matches the drawing buffer and camera aspect to the canvas size on screen.
 */
export const fitStageToCanvas = ({ renderer, camera }: Stage) => {
  const canvas = renderer.domElement;
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
};
