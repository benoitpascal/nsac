import { ConeGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { strut } from './strut';

const BODY = { radius: 2.2, height: 13, lift: 2.4 };
const NOSE_HEIGHT = 5;
const ENGINE = { radius: 1.1, height: 1.6 };
const LEG = { count: 4, spread: 4.5, radius: 0.18 };
const STEEL = 0xdfe3ea;
const DARK = 0x2a2e36;
const WINDOW_BAND = { height: 0.5, from: 0.82 };

/**
 * A tall crew lander standing on its legs, like the landers planned to bring astronauts down
 * to the Moon and Mars: a steel body and nose, an engine below, a band of windows near the top.
 */
export const createLander = () => {
  const steel = new MeshStandardMaterial({ color: STEEL, metalness: 0.3, roughness: 0.45 });
  const dark = new MeshStandardMaterial({ color: DARK, roughness: 0.6 });
  const body = new Mesh(new CylinderGeometry(BODY.radius, BODY.radius, BODY.height, 40), steel);
  body.position.y = BODY.lift + BODY.height / 2;
  const nose = new Mesh(new ConeGeometry(BODY.radius, NOSE_HEIGHT, 40), steel);
  nose.position.y = BODY.lift + BODY.height + NOSE_HEIGHT / 2;
  const engine = new Mesh(
    new CylinderGeometry(ENGINE.radius * 0.5, ENGINE.radius, ENGINE.height, 24),
    dark,
  );
  engine.position.y = BODY.lift - ENGINE.height / 2;
  const windows = new Mesh(
    new CylinderGeometry(BODY.radius + 0.02, BODY.radius + 0.02, WINDOW_BAND.height, 40, 1, true),
    dark,
  );
  windows.position.y = BODY.lift + BODY.height * WINDOW_BAND.from;
  const lander = new Group();
  lander.add(body, nose, engine, windows);
  for (let index = 0; index < LEG.count; index++) {
    const angle = (index / LEG.count) * Math.PI * 2;
    const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
    const hip = new Vector3(cos * BODY.radius, BODY.lift + 2, sin * BODY.radius);
    const foot = new Vector3(cos * LEG.spread, 0, sin * LEG.spread);
    lander.add(strut(hip, foot, LEG.radius, steel));
  }
  return lander;
};
