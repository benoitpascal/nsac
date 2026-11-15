import { ACESFilmicToneMapping, PCFShadowMap, WebGLRenderer } from 'three';

/** Brightness of the picture after tone mapping, tuned by eye on the Moon at midday. */
const EXPOSURE = 1.1;
/** Sharper than this costs a lot on high-density screens for little visible gain. */
const MAX_PIXEL_RATIO = 2;

/**
 * Creates the renderer of the walk: filtered shadows, and tone mapping so that the blinding sunlit
 * ground and the dark shade both stay readable, as a camera would show them.
 */
export const createWalkRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = EXPOSURE;
  return renderer;
};
