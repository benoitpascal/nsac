import { Group } from 'three';
import { displayRadius } from '../../nodes/display-scale';
import { createMissionPathLine } from './mission-path-line';
import { createSpacecraftMarker } from '../spacecraft-marker';
import type { ScaleMode } from '../../nodes/display-scale';
import type { SpacecraftFocus } from '../../nodes/focus-target';
import type { DisplayTrajectory } from './mission-display';
import type { Mission } from '../../../core/spacecraft/missions';

export type MissionNode = {
  holder: Group;
  focus: SpacecraftFocus;
  /** Shows the path and the craft where it is at the given time, while the mission flies. */
  update: (timestamp: number) => void;
  setScaleMode: (mode: ScaleMode) => void;
};

const COLOR = 0xff6b3d;
const FOCUS_RADIUS_IN_EARTH_RADII = 0.05;
const SOLAR_SYSTEM_FOCUS_RADIUS = 0.02;

const focusRadius = (mission: Mission, mode: ScaleMode) =>
  mission.frame === 'earth'
    ? displayRadius('earth', mode) * FOCUS_RADIUS_IN_EARTH_RADII
    : SOLAR_SYSTEM_FOCUS_RADIUS;

/**
 * Draws a mission's dashed path and its craft, relative to the center of its frame (the Earth
 * holder or the scene), only between its launch and its end.
 */
export const createMissionNode = (
  mission: Mission,
  trajectory: DisplayTrajectory,
  describe: (timestamp: number) => HTMLElement[],
  mode: ScaleMode,
): MissionNode => {
  const marker = createSpacecraftMarker(mission.name, COLOR);
  const path = createMissionPathLine(COLOR);
  const holder = new Group();
  holder.add(marker.holder, path.line);
  let scale = mode;
  let flying = false;
  let drawnFor: ScaleMode | undefined;
  const focus: SpacecraftFocus = {
    kind: 'spacecraft',
    spacecraftId: mission.id,
    home: mission.frame,
    name: mission.name,
    object: marker.holder,
    radius: focusRadius(mission, mode),
    label: marker.label,
    infoButton: marker.infoButton,
    isShown: () => flying,
    describe,
  };
  const update = (timestamp: number) => {
    const position = trajectory.positionAt(timestamp, scale);
    flying = position !== undefined;
    holder.visible = flying;
    if (!position) return;
    marker.holder.position.set(position.x, position.y, position.z);
    if (!trajectory.pathChanges && drawnFor === scale) return;
    path.draw(trajectory.pathAt(timestamp, scale));
    drawnFor = scale;
  };
  const setScaleMode = (next: ScaleMode) => {
    scale = next;
    focus.radius = focusRadius(mission, next);
  };
  return { holder, focus, update, setScaleMode };
};
