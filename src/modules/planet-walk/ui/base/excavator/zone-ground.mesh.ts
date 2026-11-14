import { Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import type { GroundZone } from '../../../core/excavator/ground-zone';

const AREA = { color: 0x2e2e2e, opacity: 0.45, height: 0.005 };
const EDGE = { width: 0.15, height: 0.008 };

const flat = (width: number, depth: number, material: MeshStandardMaterial) => {
  const mesh = new Mesh(new PlaneGeometry(width, depth), material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
};

/** Builds the zone as grey ground edged with a line of the given color, in the zone's own coordinates. */
export const createZoneGround = (zone: GroundZone, edgeColor: number) => {
  const { minX, maxX, minZ, maxZ } = zone;
  const [width, depth] = [maxX - minX, maxZ - minZ];
  const [centerX, centerZ] = [(minX + maxX) / 2, (minZ + maxZ) / 2];
  const area = flat(
    width,
    depth,
    new MeshStandardMaterial({ color: AREA.color, transparent: true, opacity: AREA.opacity }),
  );
  area.position.set(centerX, AREA.height, centerZ);
  const line = new MeshStandardMaterial({ color: edgeColor, roughness: 0.8 });
  const edges = [
    { x: centerX, z: minZ, width, depth: EDGE.width },
    { x: centerX, z: maxZ, width, depth: EDGE.width },
    { x: minX, z: centerZ, width: EDGE.width, depth },
    { x: maxX, z: centerZ, width: EDGE.width, depth },
  ].map((edge) => {
    const mesh = flat(edge.width, edge.depth, line);
    mesh.position.set(edge.x, EDGE.height, edge.z);
    return mesh;
  });
  const ground = new Group();
  ground.add(area, ...edges);
  return ground;
};
