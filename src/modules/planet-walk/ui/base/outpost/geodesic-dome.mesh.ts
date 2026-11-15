import {
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Vector3,
} from 'three';
import { domeGarden } from './dome-garden';
import { domeStruts } from './dome-struts';

/** The dome (m): its radius, how finely it is cut into triangles and its low wall. */
const DOME = { radius: 4.5, detail: 2, wall: 0.4 };

/**
 * The dome's glass triangles: the upper half of a cut sphere, its lowest corners brought down to
 * its rim so that it stands flat on its wall.
 */
const upperHalf = () => {
  const sphere = new IcosahedronGeometry(DOME.radius, DOME.detail);
  const points = sphere.getAttribute('position');
  const kept: number[] = [];
  for (let index = 0; index < points.count; index += 3) {
    const corners = [0, 1, 2].map((corner) =>
      new Vector3().fromBufferAttribute(points, index + corner),
    );
    if (corners.reduce((sum, corner) => sum + corner.y, 0) < 0) continue;
    for (const corner of corners) kept.push(corner.x, Math.max(corner.y, 0), corner.z);
  }
  const glass = new BufferGeometry();
  glass.setAttribute('position', new Float32BufferAttribute(kept, 3));
  glass.computeVertexNormals();
  return glass;
};

/**
 * Builds the greenhouse: a geodesic glass dome on a low wall, as on the base's poster, with rows of
 * plants under warm grow lights inside.
 */
export const createGeodesicDome = () => {
  const glassShape = upperHalf();
  const glass = new Mesh(
    glassShape,
    new MeshPhysicalMaterial({
      color: 0xcfe2f0,
      transparent: true,
      opacity: 0.28,
      roughness: 0.08,
      metalness: 0.1,
      side: DoubleSide,
      depthWrite: false,
    }),
  );
  const top = new Group();
  top.add(glass, domeStruts(glassShape, DOME.radius));
  top.position.y = DOME.wall;
  const wall = new Mesh(
    new CylinderGeometry(DOME.radius, DOME.radius, DOME.wall, 30),
    new MeshStandardMaterial({ color: 0x8a9099, roughness: 0.8 }),
  );
  wall.position.y = DOME.wall / 2;
  wall.castShadow = true;
  const dome = new Group();
  dome.add(wall, top, domeGarden(DOME.radius, DOME.wall));
  return dome;
};
