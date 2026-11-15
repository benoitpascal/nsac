import type { Star } from '../core/star';

type StarCatalogFile = {
  stars: number[];
};

const CATALOG_URL = '/data/stars.json';
const FIELDS_PER_STAR = 4;

/**
 * Loads the naked-eye stars (magnitude 6.5 and brighter, from the HYG Database),
 * brightest first. Throws when the catalog cannot be fetched.
 */
export const loadStarCatalog = async (): Promise<Star[]> => {
  const response = await fetch(CATALOG_URL);
  if (!response.ok) throw new Error(`Star catalog unavailable (${response.status})`);
  const { stars } = (await response.json()) as StarCatalogFile;
  return Array.from({ length: stars.length / FIELDS_PER_STAR }, (_, index) => {
    const offset = index * FIELDS_PER_STAR;
    return {
      rightAscensionHours: stars[offset],
      declinationDegrees: stars[offset + 1],
      magnitude: stars[offset + 2],
      colorIndex: stars[offset + 3],
    };
  });
};
