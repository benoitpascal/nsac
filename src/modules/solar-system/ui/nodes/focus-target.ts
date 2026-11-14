import type { SizedBodyId } from '../../core/body-radii';
import type { FocusId, SpacecraftId } from '../../core/spacecraft/spacecraft-ids';
import type { Object3D } from 'three';

/**
 * Something the camera can fly to: the object to follow, its display radius, its name label
 * and the button next to it asking for facts about it.
 */
type FocusCommon = {
  name: string;
  object: Object3D;
  radius: number;
  label: HTMLButtonElement;
  infoButton: HTMLButtonElement;
};

/** The Sun, a planet or the Moon. */
export type BodyFocus = FocusCommon & { kind: 'body'; bodyId: SizedBodyId };

/** A spacecraft, shown only at some dates, around a home body the camera falls back to. */
export type SpacecraftFocus = FocusCommon & {
  kind: 'spacecraft';
  spacecraftId: SpacecraftId;
  home: SizedBodyId;
  isShown: () => boolean;
  /** Builds the facts sections about the spacecraft at the given time (Unix ms). */
  describe: (timestamp: number) => HTMLElement[];
};

export type FocusTarget = BodyFocus | SpacecraftFocus;

/** Returns the identifier of the body or spacecraft the target shows. */
export const focusIdOf = (target: FocusTarget): FocusId =>
  target.kind === 'body' ? target.bodyId : target.spacecraftId;
