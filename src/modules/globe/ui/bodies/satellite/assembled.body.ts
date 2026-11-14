import { createSpinningBody } from '../body';
import { createSatelliteMaterials } from './satellite.materials';
import type { Body, BodyContext } from '../body';
import type { SatelliteMaterials } from './satellite.materials';
import type { Group } from 'three';

export type Assembler = (materials: SatelliteMaterials) => Group;

/**
 * Returns a body factory building a hardware model from the shared spacecraft materials,
 * scaled to fit the view.
 */
export const assembledBody =
  (assemble: Assembler, scale: number) =>
  (context: BodyContext, axialTilt: number): Promise<Body> => {
    const model = assemble(createSatelliteMaterials(context));
    model.scale.setScalar(scale);
    return Promise.resolve(createSpinningBody(model, axialTilt));
  };
