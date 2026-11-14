import { Group } from 'three';
import { orbitPeriodHours } from '../../../core/spacecraft/orbits/earth-gravity';
import { satelliteFacts } from '../../../core/info/satellite-facts';
import { earthOrbitPosition } from '../../../core/spacecraft/orbits/earth-orbit';
import { satelliteSections } from '../../info/spacecraft/satellite-sections';
import { displayRadius } from '../../nodes/display-scale';
import { geocentricSceneOffset } from '../../nodes/geocentric-scale';
import { createSatelliteOrbitLine } from './satellite-orbit-line';
import { createSpacecraftMarker } from '../spacecraft-marker';
import type { ScaleMode } from '../../nodes/display-scale';
import type { SpacecraftFocus } from '../../nodes/focus-target';
import type { Satellite } from '../../../core/spacecraft/satellites';

export type SatelliteNode = {
  holder: Group;
  focus: SpacecraftFocus;
  /** Shows the satellite from its launch, where it is at the given time (Unix ms). */
  update: (timestamp: number, simulatedMs: number) => void;
  setScaleMode: (mode: ScaleMode) => void;
};

const COLOR = 0x4de3ff;
const FOCUS_RADIUS_IN_EARTH_RADII = 0.05;
const MAX_FOLLOWED_TURNS = 0.25;
const MS_PER_HOUR = 3_600_000;

/**
 * Draws a satellite and its orbit around the Earth (to be added to the Earth holder). When it
 * makes more than a quarter turn per frame, its dot hides and its name stays still.
 */
export const createSatelliteNode = (satellite: Satellite, mode: ScaleMode): SatelliteNode => {
  const marker = createSpacecraftMarker(satellite.name, COLOR);
  const orbit = createSatelliteOrbitLine(satellite.orbit, COLOR);
  const holder = new Group();
  holder.add(marker.holder, orbit.line);
  const turnMs = orbitPeriodHours(satellite.orbit.semiMajorAxisKm) * MS_PER_HOUR;
  let scale = mode;
  let placed = false;
  const focus: SpacecraftFocus = {
    kind: 'spacecraft',
    spacecraftId: satellite.id,
    home: 'earth',
    name: satellite.name,
    object: marker.holder,
    radius: 0,
    label: marker.label,
    infoButton: marker.infoButton,
    isShown: () => holder.visible,
    describe: (timestamp) => satelliteSections(satelliteFacts(satellite, timestamp)),
  };
  const update = (timestamp: number, simulatedMs: number) => {
    holder.visible = timestamp >= satellite.launch;
    if (!holder.visible) return;
    orbit.draw(timestamp, scale);
    const tooFast = Math.abs(simulatedMs) / turnMs > MAX_FOLLOWED_TURNS;
    marker.dot.visible = !tooFast;
    if (tooFast && placed) return;
    const { x, y, z } = geocentricSceneOffset(
      earthOrbitPosition(satellite.orbit, timestamp),
      scale,
    );
    marker.holder.position.set(x, y, z);
    placed = true;
  };
  const setScaleMode = (next: ScaleMode) => {
    scale = next;
    placed = false;
    focus.radius = displayRadius('earth', next) * FOCUS_RADIUS_IN_EARTH_RADII;
  };
  setScaleMode(mode);
  return { holder, focus, update, setScaleMode };
};
