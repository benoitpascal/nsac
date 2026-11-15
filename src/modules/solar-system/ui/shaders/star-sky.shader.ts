/** Vertex shader drawing each star as a screen-sized point, bigger for brighter stars. */
export const starSkyVertexShader = /* glsl */ `
  attribute float pointSize;
  attribute float brightness;
  attribute vec3 starColor;
  uniform float pixelRatio;

  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    vColor = starColor;
    vBrightness = brightness;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = pointSize * pixelRatio;
  }
`;

/** Fragment shader drawing each star as a soft round glow. */
export const starSkyFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5) * 2.0;
    float glow = (1.0 - smoothstep(0.25, 1.0, distanceToCenter)) * vBrightness;
    gl_FragColor = vec4(vColor, glow);
  }
`;
