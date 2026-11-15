import { SPIN_BLUR_SAMPLES, spinBlurOffsetFunction } from './spin-blur.shader';

/**
 * Fragment shader blending the day and night maps along the terminator,
 * with drifting clouds, sun glint on the oceans and an atmospheric rim.
 * The surface is smeared along the spin while the spin blur is above zero.
 */
export const earthFragmentShader = /* glsl */ `
  ${spinBlurOffsetFunction}

  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D surfaceMap;
  uniform vec3 sunDirection;
  uniform float cloudsOffset;
  uniform float spinBlur;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  const vec3 SUNLIGHT = vec3(1.0, 0.96, 0.9);
  const vec3 SKY_BLUE = vec3(0.3, 0.6, 1.0);
  const vec3 TWILIGHT = vec3(1.0, 0.45, 0.2);
  const vec2 CLOUDS_THRESHOLD = vec2(0.15, 1.0);
  const float AMBIENT_LIGHT = 0.04;
  const float SUN_INTENSITY = 1.2;
  const float CITY_LIGHTS_INTENSITY = 1.6;
  const float CLOUDS_NIGHT_OCCLUSION = 0.8;
  const vec2 TERMINATOR_RANGE = vec2(-0.2, 0.25);
  const float GLINT_SHININESS = 60.0;
  const float GLINT_INTENSITY = 1.5;
  const float RIM_SHARPNESS = 3.0;
  const vec2 RIM_TINT_RANGE = vec2(-0.1, 0.6);
  const vec2 RIM_VISIBILITY_RANGE = vec2(-0.3, 1.0);

  vec3 surfaceColor(vec2 uv, float sunFacing, float glint) {
    float daylight = max(sunFacing, 0.0);
    float roughness = texture2D(surfaceMap, uv).g;
    float clouds = texture2D(surfaceMap, vec2(uv.x + cloudsOffset, uv.y)).b;
    clouds = smoothstep(CLOUDS_THRESHOLD.x, CLOUDS_THRESHOLD.y, clouds);
    vec3 day = mix(texture2D(dayMap, uv).rgb, vec3(1.0), clouds);
    day *= (AMBIENT_LIGHT + daylight * SUN_INTENSITY) * SUNLIGHT;
    vec3 night = texture2D(nightMap, uv).rgb * CITY_LIGHTS_INTENSITY;
    night *= 1.0 - clouds * CLOUDS_NIGHT_OCCLUSION;
    vec3 color = mix(night, day, smoothstep(TERMINATOR_RANGE.x, TERMINATOR_RANGE.y, sunFacing));
    float oceanMask = (1.0 - roughness) * (1.0 - clouds);
    return color + SUNLIGHT * glint * oceanMask * daylight * GLINT_INTENSITY;
  }

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float sunFacing = dot(normal, sunDirection);
    vec3 halfway = normalize(sunDirection + viewDirection);
    float glint = pow(max(dot(normal, halfway), 0.0), GLINT_SHININESS);
    vec3 color = surfaceColor(vUv, sunFacing, glint);
    if (spinBlur > 0.0) {
      color = vec3(0.0);
      for (int index = 0; index < ${SPIN_BLUR_SAMPLES}; index++) {
        vec2 uv = vec2(vUv.x + spinBlurOffset(index, spinBlur), vUv.y);
        color += surfaceColor(uv, sunFacing, glint);
      }
      color /= float(${SPIN_BLUR_SAMPLES});
    }
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), RIM_SHARPNESS);
    vec3 rimColor = mix(TWILIGHT, SKY_BLUE, smoothstep(RIM_TINT_RANGE.x, RIM_TINT_RANGE.y, sunFacing));
    float rimVisibility = smoothstep(RIM_VISIBILITY_RANGE.x, RIM_VISIBILITY_RANGE.y, sunFacing);
    color = mix(color, rimColor, fresnel * rimVisibility);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;
