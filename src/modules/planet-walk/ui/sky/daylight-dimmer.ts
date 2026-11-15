import { Light, MeshStandardMaterial } from 'three';
import type { Mesh, Object3D } from 'three';

/** Reflections left at night, from the earthshine and the base's own lamps. */
const NIGHT_REFLECTIONS = 0.12;
/** Smallest change worth walking through the materials again. */
const STEP = 0.01;

/**
 * Follows the daylight (0 at night, 1 at noon): switches on the base's outdoor lamps (marked with
 * `userData.nightLamp`, their full intensity) as it fades, and dims the soft reflections of the
 * shiny surfaces (suits, hulls, panels), which stand for sunlit ground bouncing light back up.
 */
export const createDaylightDimmer = (scene: Object3D) => {
  let materials: { material: MeshStandardMaterial; full: number }[] | undefined;
  let lamps: { lamp: Light; full: number }[] = [];
  let level = 1;
  const collect = () => {
    const found = new Map<MeshStandardMaterial, number>();
    scene.traverse((part) => {
      const { material } = part as Mesh;
      for (const candidate of Array.isArray(material) ? material : [material]) {
        if (candidate instanceof MeshStandardMaterial && candidate.envMap && !found.has(candidate))
          found.set(candidate, candidate.envMapIntensity);
      }
    });
    lamps = [];
    scene.traverse((part) => {
      const full: unknown = part.userData.nightLamp;
      if (part instanceof Light && typeof full === 'number') lamps.push({ lamp: part, full });
    });
    return [...found].map(([material, full]) => ({ material, full }));
  };
  return (daylight: number) => {
    const wanted = NIGHT_REFLECTIONS + (1 - NIGHT_REFLECTIONS) * daylight;
    if (materials && Math.abs(wanted - level) < STEP) return;
    materials ??= collect();
    level = wanted;
    for (const { material, full } of materials) material.envMapIntensity = full * level;
    for (const { lamp, full } of lamps) lamp.intensity = full * (1 - daylight) ** 2;
  };
};
