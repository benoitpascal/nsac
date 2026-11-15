/** Vertex shader passing the direction of each point of the far sky sphere, in the sky's frame. */
export const milkyWayVertexShader = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Fragment shader drawing the faint glow of our galaxy along its real plane: a thin mottled band,
 * split by dark dust lanes, swelling and warming toward the galactic center in Sagittarius.
 */
export const milkyWayFragmentShader = /* glsl */ `
  uniform vec3 galacticPole;
  uniform vec3 galacticCenter;
  uniform float intensity;

  varying vec3 vDirection;

  const vec3 DISK_COLOR = vec3(0.28, 0.45, 1.0);
  const vec3 BULGE_COLOR = vec3(0.85, 0.82, 0.95);
  const float DISK_HALF_WIDTH = 0.11;
  const float BULGE_LENGTH = 0.55;
  const float BULGE_HEIGHT = 0.16;
  const float LANE_HALF_WIDTH = 0.025;

  float hash(vec3 point) {
    return fract(sin(dot(point, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float valueNoise(vec3 point) {
    vec3 cell = floor(point);
    vec3 offset = fract(point);
    vec3 blend = offset * offset * (3.0 - 2.0 * offset);
    float near = mix(
      mix(hash(cell), hash(cell + vec3(1.0, 0.0, 0.0)), blend.x),
      mix(hash(cell + vec3(0.0, 1.0, 0.0)), hash(cell + vec3(1.0, 1.0, 0.0)), blend.x),
      blend.y
    );
    float far = mix(
      mix(hash(cell + vec3(0.0, 0.0, 1.0)), hash(cell + vec3(1.0, 0.0, 1.0)), blend.x),
      mix(hash(cell + vec3(0.0, 1.0, 1.0)), hash(cell + vec3(1.0, 1.0, 1.0)), blend.x),
      blend.y
    );
    return mix(near, far, blend.z);
  }

  float clouds(vec3 point) {
    float sum = 0.0;
    float weight = 0.5;
    for (int octave = 0; octave < 5; octave++) {
      sum += valueNoise(point) * weight;
      point *= 2.1;
      weight *= 0.5;
    }
    return sum;
  }

  void main() {
    vec3 direction = normalize(vDirection);
    float latitude = asin(clamp(dot(direction, galacticPole), -1.0, 1.0));
    vec3 side = normalize(cross(galacticPole, galacticCenter));
    float longitude = atan(dot(direction, side), dot(direction, galacticCenter));
    float mottling = clouds(direction * 9.0);
    float disk = exp(-pow(latitude / DISK_HALF_WIDTH, 2.0)) * (0.35 + 0.9 * mottling);
    float bulge = exp(-pow(longitude / BULGE_LENGTH, 2.0) - pow(latitude / BULGE_HEIGHT, 2.0));
    float dust = exp(-pow((latitude - 0.01) / LANE_HALF_WIDTH, 2.0)) * smoothstep(0.35, 0.7, clouds(direction * 23.0));
    float glow = (disk + bulge * 0.5) * (1.0 - 0.75 * dust);
    vec3 color = mix(DISK_COLOR, BULGE_COLOR, clamp(bulge, 0.0, 1.0));
    gl_FragColor = vec4(color * glow * intensity, 1.0);
  }
`;
