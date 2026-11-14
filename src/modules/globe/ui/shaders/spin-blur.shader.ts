/** Number of texture samples averaged along the spin to smear a surface. */
export const SPIN_BLUR_SAMPLES = 32;

/**
 * GLSL helper returning the horizontal offset (fraction of a turn) of the given sample,
 * spread over the given blur width and centred on zero. Each pixel shifts its samples by
 * its own random amount, so the gaps between samples show as fine grain, not as stripes.
 */
export const spinBlurOffsetFunction = /* glsl */ `
  float spinBlurOffset(int index, float width) {
    float jitter = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    return width * ((float(index) + jitter) / float(${SPIN_BLUR_SAMPLES}) - 0.5);
  }
`;

/** Replacement for three.js `map_fragment`, averaging the color map along the spin. */
export const spinBlurMapFragment = /* glsl */ `
  #ifdef USE_MAP
    vec4 sampledDiffuseColor = texture2D(map, vMapUv);
    if (spinBlur > 0.0) {
      sampledDiffuseColor = vec4(0.0);
      for (int index = 0; index < ${SPIN_BLUR_SAMPLES}; index++) {
        vec2 uv = vec2(vMapUv.x + spinBlurOffset(index, spinBlur), vMapUv.y);
        sampledDiffuseColor += texture2D(map, uv);
      }
      sampledDiffuseColor /= float(${SPIN_BLUR_SAMPLES});
    }
    diffuseColor *= sampledDiffuseColor;
  #endif
`;
