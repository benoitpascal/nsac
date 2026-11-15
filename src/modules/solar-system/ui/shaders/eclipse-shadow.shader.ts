/** Vertex shader passing the world position to the eclipse shadow shading. */
export const eclipseShadowVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

/**
 * Fragment shader darkening each point of the receiving body by the share of the Sun's disk the
 * occluder hides from it. The occluder position is relative to the receiver's center, in receiver
 * radii, so the shadow keeps its real size and place whatever the display scale. Angles use
 * atan(|a × b|, a · b), which stays precise for the tiny separations of an eclipse.
 */
export const eclipseShadowFragmentShader = /* glsl */ `
  uniform vec3 receiverCenter;
  uniform vec3 sunDirection;
  uniform float sunAngularRadius;
  uniform vec3 occluderPosition;
  uniform float occluderRadius;
  uniform vec3 shadowColor;
  uniform float maxDarkness;

  varying vec3 vWorldPosition;

  const vec2 SUNLIT_RANGE = vec2(-0.4, -0.15);

  void main() {
    vec3 surface = normalize(vWorldPosition - receiverCenter);
    vec3 toOccluder = occluderPosition - surface;
    float sunAngle = sunAngularRadius;
    float occluderAngle = asin(min(occluderRadius / length(toOccluder), 1.0));
    float separation = atan(length(cross(sunDirection, toOccluder)), dot(sunDirection, toOccluder));
    float overlap = 1.0 - smoothstep(abs(occluderAngle - sunAngle), occluderAngle + sunAngle, separation);
    float hiddenShare = overlap * min(1.0, pow(occluderAngle / sunAngle, 2.0));
    float sunlit = smoothstep(SUNLIT_RANGE.x, SUNLIT_RANGE.y, dot(surface, sunDirection));
    gl_FragColor = vec4(shadowColor, hiddenShare * sunlit * maxDarkness);
  }
`;
