import {
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
} from 'three';
import { blockMesh } from '../habitat-dimensions';
import { HUB, HUB_BLOCKS } from './hub-blocks';
import { createHubWall } from './hub-wall';
import { createStationTerminal } from './station-terminal';

const WALL_COLOR = 0xeeeeea;
const FLOOR_COLOR = 0x3a3f4a;
const GLOW = 0xffe2b0;
const LAMP = { intensity: 30, distance: 16, radius: 1.4 };
const SEGMENTS = 64;

/**
 * Builds the round central hall joining the modules of the cross: a white round wall with a
 * doorway facing each module, a flat roof with a round ceiling light, a floor and the station
 * terminal in the middle. Returns it with its solid parts (invisible boxes following the wall and the
 * terminal's desk).
 */
export const createHub = () => {
  const white = new MeshStandardMaterial({ color: WALL_COLOR, roughness: 0.6, side: DoubleSide });
  const roof = new Mesh(
    new CylinderGeometry(HUB.radius + 0.1, HUB.radius + 0.1, HUB.roof, SEGMENTS),
    white,
  );
  roof.position.y = HUB.height + HUB.roof / 2;
  const floor = new Mesh(
    new CircleGeometry(HUB.radius, SEGMENTS),
    new MeshStandardMaterial({ color: FLOOR_COLOR, roughness: 0.9 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.02;
  const glow = new MeshStandardMaterial({ color: GLOW, emissive: GLOW, emissiveIntensity: 1.5 });
  const ceilingLight = new Mesh(new CircleGeometry(LAMP.radius, 32), glow);
  ceilingLight.rotation.x = Math.PI / 2;
  ceilingLight.position.y = HUB.height - 0.01;
  const lamp = new PointLight(GLOW, LAMP.intensity, LAMP.distance);
  lamp.position.y = HUB.height - 0.5;
  const hidden = new MeshBasicMaterial();
  const collisionBoxes = HUB_BLOCKS.map((block) => blockMesh(block, hidden));
  for (const box of collisionBoxes) box.visible = false;
  const hub = new Group();
  hub.add(
    ...createHubWall(white),
    roof,
    floor,
    ceilingLight,
    lamp,
    createStationTerminal(),
    ...collisionBoxes,
  );
  return { hub, solids: collisionBoxes };
};
