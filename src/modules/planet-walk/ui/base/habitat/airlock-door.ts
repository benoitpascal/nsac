import { BoxGeometry, CircleGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial } from 'three';
import { HATCH } from './habitat-dimensions';

const DOOR = { thickness: 0.12, gap: 0.03, color: 0x9aa1ad };
const PORTHOLE = { radius: 0.16, height: 1.6, color: 0x1c2a3a };
const LIGHT = { size: 0.09, height: 1.15, x: 0.45, color: 0x3dff8a };

/**
 * Builds the closed airlock door filling a hatch, across z: a grey panel with a dark round
 * porthole and a green light on both faces. Returns it with the panel the walker bumps into.
 */
export const createAirlockDoor = () => {
  const panel = new Mesh(
    new BoxGeometry(HATCH.width - DOOR.gap, HATCH.height - DOOR.gap, DOOR.thickness),
    new MeshStandardMaterial({ color: DOOR.color, metalness: 0.5, roughness: 0.45 }),
  );
  panel.position.y = HATCH.height / 2;
  const glass = new MeshStandardMaterial({
    color: PORTHOLE.color,
    metalness: 0.8,
    roughness: 0.1,
    side: DoubleSide,
  });
  const glow = new MeshStandardMaterial({
    color: LIGHT.color,
    emissive: LIGHT.color,
    emissiveIntensity: 2,
  });
  const door = new Group();
  door.add(panel);
  for (const face of [-1, 1]) {
    const porthole = new Mesh(new CircleGeometry(PORTHOLE.radius, 24), glass);
    porthole.position.set(0, PORTHOLE.height, face * (DOOR.thickness / 2 + 0.005));
    const light = new Mesh(new BoxGeometry(LIGHT.size, LIGHT.size, 0.02), glow);
    light.position.set(LIGHT.x, LIGHT.height, face * (DOOR.thickness / 2 + 0.01));
    door.add(porthole, light);
  }
  return { door, solid: panel };
};
