import { DoubleSide, MeshStandardMaterial, PointLight } from 'three';
import { MODULE } from '../habitat-dimensions';
import { bulkhead } from '../bulkhead';
import { hatchFrame } from '../habitat-hull-details';

const WALL_COLOR = 0xeeeeea;
const LAMP = { color: 0xffe2b0, intensity: 20, height: 3.4, everyM: 12 };

/** Lamps spread along a wing of the given length (m), about one every 12 m. */
export const wingLamps = (length: number) => {
  const count = Math.ceil(length / LAMP.everyM);
  return Array.from({ length: count }, (_, index) => {
    const lamp = new PointLight(LAMP.color, LAMP.intensity, length / count + LAMP.everyM / 2);
    lamp.position.set(0, LAMP.height, -length / 2 + ((index + 0.5) * length) / count);
    return lamp;
  });
};

/** White walls across a wing at the given places (z), each with an orange-framed doorway. */
export const doorwayWalls = (places: readonly number[]) => {
  const material = new MeshStandardMaterial({
    color: WALL_COLOR,
    roughness: 0.6,
    side: DoubleSide,
  });
  return places.flatMap((z) => {
    const wall = bulkhead(material, true);
    wall.position.set(0, MODULE.axisHeight, z);
    const frame = hatchFrame(z);
    frame.position.y = MODULE.axisHeight;
    return [wall, frame];
  });
};
