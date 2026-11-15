import { zoneAround } from '../../../core/excavator/ground-zone';
import { BASE_SITE, DIG_SITE_SPOT, DIG_ZONE, DROP_ZONE } from '../base-layout';
import { createDropSite } from './drop-site';
import { createExcavatorSite } from './excavator-site';

/**
 * Builds the regolith work sites of the base, placed from the base center: the dig site with its
 * robot and the drop-off zone. Returns them with their solid parts, the robot's controls, and
 * where the dig site and both zones stand in the world.
 */
export const createRegolithSites = () => {
  const digSite = createExcavatorSite();
  digSite.site.position.set(DIG_SITE_SPOT.x, 0, DIG_SITE_SPOT.z);
  const dropSite = createDropSite(DROP_ZONE);
  const digSpot = { x: BASE_SITE.x + DIG_SITE_SPOT.x, z: BASE_SITE.z + DIG_SITE_SPOT.z };
  return {
    sites: [digSite.site, dropSite.site],
    solids: digSite.solids,
    excavator: digSite.controls,
    digSite: digSpot,
    digZone: zoneAround(DIG_ZONE, digSpot),
    dropZone: zoneAround(DROP_ZONE, BASE_SITE),
    fillDropSite: dropSite.fill,
  };
};
