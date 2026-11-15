import { eclipseGeometry } from '../core/eclipse-geometry';
import { createEclipseShadow } from './nodes/eclipse-shadow.mesh';
import type { MoonNode } from './nodes/moon.node';
import type { PlanetNode } from './nodes/planet.node';

const MOON_SHADOW_ON_EARTH = { color: 0x000208, maxDarkness: 0.85 };
const EARTH_SHADOW_ON_MOON = { color: 0x5a1a08, maxDarkness: 0.85 };

/**
 * Adds the eclipse shadows (the Moon's on the Earth, the Earth's reddish one on the Moon)
 * and returns how to update them for a given time (Unix timestamp in ms).
 */
export const createEclipseShadows = (earth: PlanetNode, moon: MoonNode) => {
  const onEarth = createEclipseShadow(earth.holder, MOON_SHADOW_ON_EARTH);
  const onMoon = createEclipseShadow(moon.holder, EARTH_SHADOW_ON_MOON);
  earth.holder.add(onEarth.mesh);
  moon.holder.add(onMoon.mesh);
  return (timestamp: number) => {
    const geometry = eclipseGeometry(timestamp);
    onEarth.update(geometry.onEarth, earth.focus.radius);
    onMoon.update(geometry.onMoon, moon.focus.radius);
  };
};
