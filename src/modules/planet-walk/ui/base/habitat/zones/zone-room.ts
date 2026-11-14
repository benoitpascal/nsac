import { Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { blockMesh } from '../habitat-dimensions';
import type { ZoneItem, ZonePlan } from './zone-plan';

const GLOW_INTENSITY = 1.3;
/** Glowing panel along the ceiling of each room (m). */
const CEILING_LIGHT = { color: 0xffe2b0, height: 3.68, width: 1.2, margin: 0.8 };

const itemMesh = ({ block, color, glow }: ZoneItem) =>
  blockMesh(
    block,
    glow
      ? new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: GLOW_INTENSITY })
      : new MeshStandardMaterial({ color, roughness: 0.7 }),
  );

/**
 * Builds a room of a wing, centered on the origin along z: its furniture, which is also what the
 * walker bumps into, and a glowing ceiling panel.
 */
export const createZoneRoom = (zone: ZonePlan) => {
  const solids = zone.items.map(itemMesh);
  const panel = new Mesh(
    new PlaneGeometry(CEILING_LIGHT.width, zone.length - CEILING_LIGHT.margin),
    new MeshStandardMaterial({
      color: CEILING_LIGHT.color,
      emissive: CEILING_LIGHT.color,
      emissiveIntensity: GLOW_INTENSITY,
    }),
  );
  panel.rotation.x = Math.PI / 2;
  panel.position.y = CEILING_LIGHT.height;
  const room = new Group();
  room.add(...solids, panel);
  return { room, solids };
};
