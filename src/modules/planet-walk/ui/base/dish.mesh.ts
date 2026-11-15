import {
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  Vector2,
  Vector3,
} from 'three';
import { earthDirection } from '../../core/sky/lunar-sky';

/** The dish (m): its rim radius, its focal length, and the pedestal holding it. */
const DISH = { radius: 1.6, focal: 0.9, pedestal: 1.4, feed: 0.12 };
const WHITE = 0xf2f2ee;
const GREY = 0x6b707a;

const bowl = (material: MeshStandardMaterial) => {
  const outline = Array.from({ length: 13 }, (_, index) => {
    const radius = (index / 12) * DISH.radius;
    return new Vector2(radius, (radius * radius) / (4 * DISH.focal));
  });
  return new Mesh(new LatheGeometry(outline, 48), material);
};

/** The feed at the dish's focus, held by three struts from the rim. */
const feed = (material: MeshStandardMaterial) => {
  const parts = new Group();
  const horn = new Mesh(new CylinderGeometry(DISH.feed, DISH.feed * 0.7, 0.3, 12), material);
  horn.position.y = DISH.focal;
  parts.add(horn);
  const rimHeight = (DISH.radius * DISH.radius) / (4 * DISH.focal);
  for (let index = 0; index < 3; index++) {
    const angle = (index * 2 * Math.PI) / 3;
    const from = new Vector3(
      Math.cos(angle) * DISH.radius,
      rimHeight,
      Math.sin(angle) * DISH.radius,
    );
    const to = new Vector3(0, DISH.focal, 0);
    const strut = new Mesh(new CylinderGeometry(0.025, 0.025, from.distanceTo(to), 6), material);
    strut.position.copy(from).add(to).multiplyScalar(0.5);
    strut.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), to.clone().sub(from).normalize());
    parts.add(strut);
  }
  return parts;
};

/**
 * Builds a radio dish on its pedestal, pointed at the Earth: the Earth never moves in the Moon's
 * sky, high in the west over the base, so the dish never has to move either.
 */
export const createEarthDish = () => {
  const white = new MeshStandardMaterial({ color: WHITE, roughness: 0.5, side: DoubleSide });
  const grey = new MeshStandardMaterial({ color: GREY, roughness: 0.5, metalness: 0.4 });
  const pedestal = new Mesh(new CylinderGeometry(0.14, 0.22, DISH.pedestal, 12), grey);
  pedestal.position.y = DISH.pedestal / 2;
  const pointing = new Group();
  pointing.add(bowl(white), feed(grey));
  pointing.position.y = DISH.pedestal + 0.3;
  pointing.quaternion.copy(
    new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), new Vector3().copy(earthDirection())),
  );
  const dish = new Group();
  dish.add(pedestal, pointing);
  dish.traverse((part) => {
    part.castShadow = true;
  });
  return dish;
};
