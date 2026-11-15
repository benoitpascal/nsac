import { BoxGeometry, Group, Mesh, MeshStandardMaterial, PointLight } from 'three';

const BED = { width: 0.9, height: 0.6, gap: 1.6, leaves: 0.35 };
const GROW_LIGHT = { color: 0xffb070, intensity: 14, reach: 9, glow: 2.2 };

/**
 * Rows of plant beds inside the dome, fitting within its radius (m) above its wall, with warm
 * grow lights hanging over them that make the dome glow at night.
 */
export const domeGarden = (radius: number, floor: number) => {
  const soil = new MeshStandardMaterial({ color: 0x5b4636, roughness: 0.9 });
  const leaves = new MeshStandardMaterial({ color: 0x4f9a3c, roughness: 0.8 });
  const glow = new MeshStandardMaterial({
    color: GROW_LIGHT.color,
    emissive: GROW_LIGHT.color,
    emissiveIntensity: GROW_LIGHT.glow,
  });
  const garden = new Group();
  for (const x of [-BED.gap, 0, BED.gap]) {
    const length = 2 * Math.sqrt(radius * radius - x * x) - 2;
    const bed = new Mesh(new BoxGeometry(BED.width, BED.height, length), soil);
    bed.position.set(x, floor + BED.height / 2, 0);
    const plants = new Mesh(new BoxGeometry(BED.width * 0.9, BED.leaves, length * 0.95), leaves);
    plants.position.set(x, floor + BED.height + BED.leaves / 2, 0);
    const lamp = new Mesh(new BoxGeometry(0.2, 0.06, length * 0.8), glow);
    lamp.position.set(x, floor + 2.6, 0);
    garden.add(bed, plants, lamp);
  }
  const light = new PointLight(GROW_LIGHT.color, GROW_LIGHT.intensity, GROW_LIGHT.reach);
  light.position.y = floor + 2.4;
  light.userData.nightLamp = GROW_LIGHT.intensity;
  garden.add(light);
  return garden;
};
