import { Group } from 'three';
import { SATELLITES } from '../../../core/spacecraft/satellites';
import { createSatelliteNode } from './satellite.node';
import type { ScaleMode } from '../../nodes/display-scale';
import type { SpacecraftFocus } from '../../nodes/focus-target';
import type { Object3D } from 'three';

export type SatelliteLayer = {
  targets: SpacecraftFocus[];
  /** Moves the satellites to the given time, drawn only when the camera is close to the Earth. */
  update: (timestamp: number, simulatedMs: number, closeToEarth: boolean) => void;
  setScaleMode: (mode: ScaleMode) => void;
};

/** Adds the famous satellites around the Earth, to the Earth holder. */
export const createSatelliteLayer = (earthHolder: Object3D, mode: ScaleMode): SatelliteLayer => {
  const layer = new Group();
  const nodes = SATELLITES.map((satellite) => createSatelliteNode(satellite, mode));
  layer.add(...nodes.map((node) => node.holder));
  earthHolder.add(layer);
  return {
    targets: nodes.map((node) => node.focus),
    update: (timestamp, simulatedMs, closeToEarth) => {
      layer.visible = closeToEarth;
      for (const node of nodes) node.update(timestamp, simulatedMs);
    },
    setScaleMode: (mode) => {
      for (const node of nodes) node.setScaleMode(mode);
    },
  };
};
