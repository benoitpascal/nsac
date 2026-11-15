import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  SpotLight,
} from 'three';

const POST = { radius: 0.07, height: 3.5, lamp: 0.18 };
const LAMP_GLOW = 0xfff1c8;
const POST_COLOR = 0x5a606b;
/** The lamp's beam on the ground below it (candela, m, radians). */
const BEAM = { intensity: 60, reach: 16, angle: 1.05, penumbra: 0.7 };

/** A thin lamp post with a glowing light on top, lighting the paths of the base. */
export const createLampPost = () => {
  const post = new Mesh(
    new CylinderGeometry(POST.radius, POST.radius * 1.5, POST.height, 8),
    new MeshStandardMaterial({ color: POST_COLOR }),
  );
  post.position.y = POST.height / 2;
  const lamp = new Mesh(
    new SphereGeometry(POST.lamp, 12, 8),
    new MeshStandardMaterial({ color: LAMP_GLOW, emissive: LAMP_GLOW, emissiveIntensity: 2 }),
  );
  lamp.position.y = POST.height + POST.lamp;
  const beam = new SpotLight(LAMP_GLOW, BEAM.intensity, BEAM.reach, BEAM.angle, BEAM.penumbra);
  beam.position.y = POST.height;
  beam.userData.nightLamp = BEAM.intensity;
  beam.target.position.y = 0;
  const lampPost = new Group();
  lampPost.add(post, lamp, beam, beam.target);
  return lampPost;
};
