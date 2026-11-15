import { ConeGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { beacon, lightBeam } from './drop-markers';
import { createZoneSign } from '../habitat/zones/zone-sign';
import { createZoneGround } from './zone-ground.mesh';
import type { GroundZone } from '../../../core/excavator/ground-zone';

/** Red, like the drop-off zone on the map and in the goals. */
const EDGE_COLOR = 0xed5f79;
const PILE_COLOR = 0x7a746c;
/** The full pile (m) and how much regolith (kg) it holds, at about 1.5 t per cubic meter. */
const PILE = { radius: 1.5, height: 1, fullKg: 3500, maxScale: 1.5 };
const POST = { radius: 0.05, height: 2.4, color: 0x9aa1ad };
const SIGN_TEXT = 'Regolith drop-off';
/** The zone stands out: red-tinted ground and wide edges, which glow while it is lit. */
const LOOK = { areaColor: 0x5a1a26, areaOpacity: 0.55, edgeWidth: 0.4 };
const EDGE_GLOW = 0.8;
/**
 * Builds the drop-off zone where the robot unloads its regolith: red-tinted ground with wide red
 * edges, which glow with a red light at each corner and a light beam above it only while it is lit
 * (during the robot mission), a signpost readable from both sides at its corner, and a
 * pile growing with the regolith dropped off.
 */
export const createDropSite = (zone: GroundZone) => {
  const centerX = (zone.minX + zone.maxX) / 2;
  const centerZ = (zone.minZ + zone.maxZ) / 2;
  const pile = new Mesh(
    new ConeGeometry(PILE.radius, PILE.height, 24),
    new MeshStandardMaterial({ color: PILE_COLOR, roughness: 1, flatShading: true }),
  );
  pile.geometry.translate(0, PILE.height / 2, 0);
  pile.position.set(centerX, 0, centerZ);
  pile.visible = false;
  const post = new Mesh(
    new CylinderGeometry(POST.radius, POST.radius, POST.height, 12),
    new MeshStandardMaterial({ color: POST.color, metalness: 0.6, roughness: 0.4 }),
  );
  post.position.set(zone.maxX, POST.height / 2, zone.minZ);
  const signs = [-1, 1].map((face) => {
    const sign = createZoneSign(SIGN_TEXT);
    sign.position.set(zone.maxX, POST.height, zone.minZ + face * (POST.radius + 0.01));
    sign.rotation.y = face < 0 ? Math.PI : 0;
    return sign;
  });
  const site = new Group();
  const corners = [
    [zone.minX, zone.minZ],
    [zone.minX, zone.maxZ],
    [zone.maxX, zone.maxZ],
  ].flatMap(([x, z]) => beacon(x, z));
  const lights = new Group();
  lights.add(...corners, lightBeam(centerX, centerZ));
  const ground = createZoneGround(zone, EDGE_COLOR, LOOK);
  const light = (on: boolean) => {
    lights.visible = on;
    ground.edge.emissiveIntensity = on ? EDGE_GLOW : 0;
  };
  light(false);
  site.add(ground, post, ...signs, lights, pile);
  return {
    site,
    /** Lights the zone up (glowing edges, corner lights, light beam) or turns it off. */
    light,
    /** Grows the pile to hold the regolith dropped off so far (kg). */
    fill: (deliveredKg: number) => {
      pile.visible = deliveredKg > 0;
      pile.scale.setScalar(Math.min(Math.cbrt(deliveredKg / PILE.fullKg), PILE.maxScale));
    },
  };
};
