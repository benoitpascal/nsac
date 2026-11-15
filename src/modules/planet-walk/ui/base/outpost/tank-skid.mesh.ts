import {
  BoxGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'three';

/** A row of tanks (m): how many, their radius, the length of their straight part, and how they lie. */
export type TankRow = { count: number; radius: number; length: number; upright: boolean };
const SKID = { height: 0.3, margin: 0.3 };

/**
 * Builds white pressure tanks standing or lying side by side on a grey steel skid, with an orange
 * band around each one: water, oxygen or the electrolyzer's gases.
 */
export const createTankSkid = ({ count, radius, length, upright }: TankRow) => {
  const white = new MeshStandardMaterial({ color: 0xeeeeea, roughness: 0.45, metalness: 0.2 });
  const orange = new MeshStandardMaterial({ color: 0xe0862a, roughness: 0.6 });
  const steel = new MeshStandardMaterial({ color: 0x6b707a, metalness: 0.6, roughness: 0.4 });
  const spacing = 2 * radius + 0.2;
  const across = count * spacing;
  const along = upright ? spacing : length + 2 * radius;
  const skid = new Mesh(
    new BoxGeometry(across + SKID.margin, SKID.height, along + SKID.margin),
    steel,
  );
  skid.position.y = SKID.height / 2;
  const row = new Group();
  row.add(skid);
  for (let index = 0; index < count; index++) {
    const tank = new Group();
    const shell = new Mesh(new CapsuleGeometry(radius, length, 8, 20), white);
    const band = new Mesh(new CylinderGeometry(radius + 0.02, radius + 0.02, 0.15, 20), orange);
    tank.add(shell, band);
    if (!upright) tank.rotation.x = Math.PI / 2;
    const lift = upright ? length / 2 + radius : radius;
    tank.position.set((index + 0.5) * spacing - across / 2, SKID.height + lift, 0);
    row.add(tank);
  }
  row.traverse((part) => {
    part.castShadow = true;
  });
  return row;
};
