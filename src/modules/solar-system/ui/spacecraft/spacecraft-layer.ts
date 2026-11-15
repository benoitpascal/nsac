import { Group, Vector3 } from 'three';
import { missionFacts } from '../../core/info/mission-facts';
import { missionSections } from '../info/spacecraft/mission-sections';
import { displayRadius } from '../nodes/display-scale';
import { displayTrajectory } from './missions/mission-display';
import { createMissionNode } from './missions/mission.node';
import { createSatelliteLayer } from './satellites/satellite-layer';
import type { ScaleMode } from '../nodes/display-scale';
import type { SpacecraftFocus } from '../nodes/focus-target';
import type { DisplayTrajectory } from './missions/mission-display';
import type { Mission } from '../../core/spacecraft/missions';
import type { MissionTrajectory } from '../../core/spacecraft/mission-trajectory';
import type { Object3D } from 'three';

/** A mission with its trajectory, and how to show it when not by its frame's usual scale. */
export type FlownMission = {
  mission: Mission;
  trajectory: MissionTrajectory;
  display?: DisplayTrajectory;
};

export type SpacecraftLayer = {
  /** Spacecraft flying in the solar system, to add to the scene. */
  solarSystemGroup: Group;
  targets: SpacecraftFocus[];
  /** Moves every spacecraft to the given time; those around the Earth show only up close. */
  update: (timestamp: number, simulatedMs: number, camera: Object3D) => void;
  setScaleMode: (mode: ScaleMode) => void;
};

const SHOWN_WITHIN_EARTH_RADII = 20;
const SHOWN_WITHIN_CRAFT_DISTANCES = 4;

/** Adds the satellites and the missions around the Earth and in the solar system. */
export const createSpacecraftLayer = (
  earthHolder: Object3D,
  mode: ScaleMode,
  missions: FlownMission[],
): SpacecraftLayer => {
  const satellites = createSatelliteLayer(earthHolder, mode);
  const nodes = missions.map(({ mission, trajectory, display }) => ({
    frame: mission.frame,
    node: createMissionNode(
      mission,
      display ?? displayTrajectory(mission, trajectory),
      (timestamp) => missionSections(missionFacts(mission, trajectory, timestamp)),
      mode,
    ),
  }));
  const solarSystemGroup = new Group();
  for (const { frame, node } of nodes)
    (frame === 'earth' ? earthHolder : solarSystemGroup).add(node.holder);
  const earthPosition = new Vector3();
  let scale = mode;
  return {
    solarSystemGroup,
    targets: [...satellites.targets, ...nodes.map(({ node }) => node.focus)],
    update: (timestamp, simulatedMs, camera) => {
      earthHolder.getWorldPosition(earthPosition);
      const cameraDistance = camera.position.distanceTo(earthPosition);
      const nearLimit = displayRadius('earth', scale) * SHOWN_WITHIN_EARTH_RADII;
      satellites.update(timestamp, simulatedMs, cameraDistance < nearLimit);
      for (const { frame, node } of nodes) {
        node.update(timestamp);
        if (frame !== 'earth' || !node.holder.visible) continue;
        const craftDistance = node.focus.object.position.length();
        node.holder.visible =
          cameraDistance < Math.max(nearLimit, craftDistance * SHOWN_WITHIN_CRAFT_DISTANCES);
      }
    },
    setScaleMode: (next) => {
      scale = next;
      satellites.setScaleMode(next);
      for (const { node } of nodes) node.setScaleMode(next);
    },
  };
};
