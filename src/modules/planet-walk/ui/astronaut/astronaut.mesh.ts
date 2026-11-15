import { Group } from 'three';
import { createSuitMaterials } from './astronaut-materials';
import { createSuitBody } from './suit-body';
import { createArm, createLeg } from './suit-limbs';
import type { WebGLRenderer } from 'three';

const HIP = { x: 0.11, y: 0.95 };
const SHOULDER = { x: 0.3, y: 1.42 };

/**
 * Builds an astronaut in a NASA-style surface spacesuit, about 1.85 m tall, standing at the
 * origin and facing -z. Returns it with its body (to bob while walking) and its arms and legs,
 * listed left then right, which turn at the shoulders and hips and bend at the elbows and knees.
 */
export const createAstronaut = (renderer: WebGLRenderer) => {
  const suit = createSuitMaterials(renderer);
  const legs = [-1, 1].map((side) => createLeg([side * HIP.x, HIP.y, 0], suit));
  const arms = [-1, 1].map((side) => createArm([side * SHOULDER.x, SHOULDER.y, 0], side, suit));
  const body = new Group();
  body.add(createSuitBody(suit), ...arms.map((arm) => arm.root));
  const astronaut = new Group();
  astronaut.add(body, ...legs.map((leg) => leg.root));
  return { astronaut, body, arms, legs };
};
