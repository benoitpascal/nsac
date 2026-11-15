/** Vertex shader passing view-space normal and direction, and world normal, to the atmosphere shading. */
export const atmosphereVertexShader = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewDirection;
  varying vec3 vWorldNormal;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vViewNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-viewPosition.xyz);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

/**
 * Fragment shader for the back faces of the atmosphere shell: a halo fading outwards
 * from the planet edge, brighter on the sunlit side.
 */
export const atmosphereFragmentShader = /* glsl */ `
  uniform vec3 sunDirection;
  uniform float shellThickness;

  varying vec3 vViewNormal;
  varying vec3 vViewDirection;
  varying vec3 vWorldNormal;

  const vec3 SKY_BLUE = vec3(0.3, 0.6, 1.0);
  const float HALO_FALLOFF = 2.5;
  const vec2 LIT_RANGE = vec2(-0.4, 0.6);
  const float NIGHT_SIDE_GLOW = 0.15;
  const float DAY_SIDE_GLOW = 1.1;

  void main() {
    float towardsSurface = -dot(normalize(vViewNormal), normalize(vViewDirection));
    float halo = pow(clamp(towardsSurface / shellThickness, 0.0, 1.0), HALO_FALLOFF);
    float lit = smoothstep(LIT_RANGE.x, LIT_RANGE.y, dot(normalize(vWorldNormal), sunDirection));
    float glow = clamp(halo * (NIGHT_SIDE_GLOW + lit * DAY_SIDE_GLOW), 0.0, 1.0);
    gl_FragColor = vec4(SKY_BLUE * glow, glow);
    #include <colorspace_fragment>
  }
`;
