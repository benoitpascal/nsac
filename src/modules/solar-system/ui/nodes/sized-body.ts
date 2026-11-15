import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { displayRadius, modelScaleFor } from './display-scale';
import type { ScaleMode } from './display-scale';
import type { SizedBodyId } from '../../core/body-radii';
import type { CelestialBody } from '@/modules/globe/core/bodies';
import type { Body } from '@/modules/globe/ui/bodies/body';
import type { BodyFocus } from './focus-target';
import type { Object3D } from 'three';

/** A body shown at its size for the current scale, with its clickable name above it. */
export type SizedBody = {
  focus: BodyFocus;
  setScaleMode: (mode: ScaleMode) => void;
};

const LABEL_GROUP_CLASS = 'planet-label-group';
const LABEL_CLASS = 'planet-label';
const INFO_BUTTON_CLASS = 'planet-info-button';
const INFO_BUTTON_TEXT = 'i';

const createButton = (className: string, text: string, ariaLabel: string) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = text;
  button.setAttribute('aria-label', ariaLabel);
  return button;
};

/** Creates the clickable name of a body or spacecraft, followed by its facts button. */
export const createLabel = (name: string, modifierClass: string) => {
  const button = createButton(`${LABEL_CLASS} ${modifierClass}`.trim(), name, `Go to ${name}`);
  const infoButton = createButton(INFO_BUTTON_CLASS, INFO_BUTTON_TEXT, `Facts about ${name}`);
  const group = document.createElement('div');
  group.className = LABEL_GROUP_CLASS;
  group.append(button, infoButton);
  return { label: new CSS2DObject(group), button, infoButton };
};

/**
 * Adds the body model and its name label to the holder, sized for the given scale,
 * with an optional label modifier class.
 */
export const createSizedBody = (
  celestial: CelestialBody & { id: SizedBodyId },
  body: Body,
  holder: Object3D,
  mode: ScaleMode,
  modifierClass = '',
): SizedBody => {
  const { label, button, infoButton } = createLabel(celestial.name, modifierClass);
  holder.add(body.root, label);
  const focus: BodyFocus = {
    kind: 'body',
    bodyId: celestial.id,
    name: celestial.name,
    object: holder,
    radius: 0,
    label: button,
    infoButton,
  };
  const setScaleMode = (nextMode: ScaleMode) => {
    const radius = displayRadius(celestial.id, nextMode);
    body.root.scale.setScalar(modelScaleFor(celestial.id, radius));
    label.position.y = radius;
    focus.radius = radius;
  };
  setScaleMode(mode);
  return { focus, setScaleMode };
};
