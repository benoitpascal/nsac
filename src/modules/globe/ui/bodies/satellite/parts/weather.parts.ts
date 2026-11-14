import { Group } from 'three';
import { createBox, createCylinder, createDish, createSolarWing } from '../satellite.shapes';
import type { SatelliteMaterials } from '../satellite.materials';

const BODY = { radius: 0.3, height: 0.75 };
const BAND_HEIGHT = 0.12;
const WING = {
  side: -1 as const,
  from: BODY.radius,
  boomLength: 0.25,
  panelLength: 1,
  panelWidth: 0.55,
};
const PANEL_TILT = 0.5;
const INSTRUMENT = { x: 0.3, y: 0.25, z: 0.2 };
const INSTRUMENT_HEIGHT = 0.1;
const INSTRUMENT_INSET = 0.03;
const APERTURE = { radius: 0.08, depth: 0.02 };
const DISH_RADIUS = 0.15;
const DISH_OPENING = Math.PI / 3.5;

const createImager = (materials: SatelliteMaterials) => {
  const front = BODY.radius - INSTRUMENT_INSET + INSTRUMENT.z;
  const housing = createBox(INSTRUMENT, materials.silverFoil);
  housing.position.z = front - INSTRUMENT.z / 2;
  const aperture = createCylinder(APERTURE.radius, APERTURE.depth, 'z', materials.aperture);
  aperture.position.z = front;
  const imager = new Group();
  imager.add(housing, aperture);
  imager.position.y = INSTRUMENT_HEIGHT;
  return imager;
};

/**
 * Assembles a weather satellite: a white cylindrical body with a gold band,
 * a single tilted solar wing, an imaging instrument and a small dish.
 */
export const assembleWeatherSatellite = (materials: SatelliteMaterials): Group => {
  const body = createCylinder(BODY.radius, BODY.height, 'y', materials.whitePaint);
  const band = createCylinder(BODY.radius * 1.01, BAND_HEIGHT, 'y', materials.foil);
  band.position.y = -BODY.height / 2 + BAND_HEIGHT / 2;
  const wing = createSolarWing(WING, materials);
  wing.rotation.x = PANEL_TILT;
  const dish = createDish(DISH_RADIUS, DISH_OPENING, materials.dish);
  dish.position.y = BODY.height / 2;
  const satellite = new Group();
  satellite.add(body, band, wing, createImager(materials), dish);
  return satellite;
};
