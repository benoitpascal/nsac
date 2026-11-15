import { Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import type { GroundZone } from '../../../core/excavator/ground-zone';

const AREA = { color: 0x2e2e2e, opacity: 0.45, height: 0.005 };
const EDGE = { width: 0.15, height: 0.008 };

const flat = (width: number, depth: number, material: MeshStandardMaterial) => {
  const mesh = new Mesh(new PlaneGeometry(width, depth), material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
};

/** How a zone stands out: its ground tint, and how wide and bright its edge lines are. */
export type ZoneLook = {
  areaColor?: number;
  areaOpacity?: number;
  edgeWidth?: number;
  glow?: number;
};

/**
 * Builds the zone as tinted ground (grey by default) edged with a line of the given color, which
 * can glow to be seen at night, in the zone's own coordinates.
 */
export const createZoneGround = (zone: GroundZone, edgeColor: number, look: ZoneLook = {}) => {
  const edgeWidth = look.edgeWidth ?? EDGE.width;
  const { minX, maxX, minZ, maxZ } = zone;
  const [width, depth] = [maxX - minX, maxZ - minZ];
  const [centerX, centerZ] = [(minX + maxX) / 2, (minZ + maxZ) / 2];
  const area = flat(
    width,
    depth,
    new MeshStandardMaterial({
      color: look.areaColor ?? AREA.color,
      transparent: true,
      opacity: look.areaOpacity ?? AREA.opacity,
    }),
  );
  area.position.set(centerX, AREA.height, centerZ);
  const line = new MeshStandardMaterial({
    color: edgeColor,
    roughness: 0.8,
    emissive: edgeColor,
    emissiveIntensity: look.glow ?? 0,
  });
  const edges = [
    { x: centerX, z: minZ, width, depth: edgeWidth },
    { x: centerX, z: maxZ, width, depth: edgeWidth },
    { x: minX, z: centerZ, width: edgeWidth, depth },
    { x: maxX, z: centerZ, width: edgeWidth, depth },
  ].map((edge) => {
    const mesh = flat(edge.width, edge.depth, line);
    mesh.position.set(edge.x, EDGE.height, edge.z);
    return mesh;
  });
  const ground = new Group();
  ground.add(area, ...edges);
  return ground;
};
