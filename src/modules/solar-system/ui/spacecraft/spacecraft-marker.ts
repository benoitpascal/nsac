import { BufferGeometry, Float32BufferAttribute, Group, Points, PointsMaterial } from 'three';
import { createLabel } from '../nodes/sized-body';

/** A spacecraft drawn as a dot of fixed size on screen, with its clickable name. */
export type SpacecraftMarker = {
  holder: Group;
  dot: Points;
  label: HTMLButtonElement;
  infoButton: HTMLButtonElement;
};

const DOT_PIXELS = 6;
const LABEL_CLASS = 'planet-label--spacecraft';

/** Creates the dot and name of a spacecraft, in the given color. */
export const createSpacecraftMarker = (name: string, color: number): SpacecraftMarker => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3));
  const material = new PointsMaterial({ color, size: DOT_PIXELS, sizeAttenuation: false });
  const dot = new Points(geometry, material);
  const { label, button, infoButton } = createLabel(name, LABEL_CLASS);
  const holder = new Group();
  holder.add(dot, label);
  return { holder, dot, label: button, infoButton };
};
