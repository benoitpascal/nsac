import { bodyFacts } from '../../core/info/body-facts';
import { BODY_COLORS } from './body-colors';
import {
  dayAndYearSection,
  earthDistanceSection,
  sizeSection,
  sunDistanceSection,
} from './info-sections';
import type { DescribedBody } from './info-sections';
import type { BodyFocus, SpacecraftFocus } from '../nodes/focus-target';

const createHeading = (name: string) => {
  const heading = document.createElement('h2');
  heading.textContent = name;
  return heading;
};

const describedAt = (target: BodyFocus, timestamp: number): DescribedBody => ({
  id: target.bodyId,
  name: target.name,
  color: BODY_COLORS[target.bodyId],
  facts: bodyFacts(target.bodyId, timestamp),
});

/**
 * Builds the facts sheet of a body: its size compared to another body, its day and year,
 * and its current distances from the Sun and the Earth, with drawings to scale.
 */
const renderBodyFacts = (body: DescribedBody, earth: DescribedBody, comparison: DescribedBody) => {
  const { distanceFromSunKm, distanceFromEarthKm } = body.facts;
  const sections = [sizeSection(body, comparison), dayAndYearSection(body)];
  if (distanceFromSunKm !== undefined)
    sections.push(sunDistanceSection(body, earth, distanceFromSunKm));
  if (distanceFromEarthKm !== undefined) sections.push(earthDistanceSection(distanceFromEarthKm));
  return sections;
};

/**
 * Builds the titled facts sheet of a body at the given time (Unix ms), compared in size to
 * another body and placed relative to the Earth.
 */
export const renderFactsSheet = (
  target: BodyFocus,
  earth: BodyFocus,
  comparison: BodyFocus,
  timestamp: number,
) => {
  const heading = createHeading(target.name);
  const sections = renderBodyFacts(
    describedAt(target, timestamp),
    describedAt(earth, timestamp),
    describedAt(comparison, timestamp),
  );
  return [heading, ...sections];
};

/** Builds the titled facts sheet of a spacecraft at the given time (Unix ms). */
export const renderSpacecraftSheet = (target: SpacecraftFocus, timestamp: number) => [
  createHeading(target.name),
  ...target.describe(timestamp),
];
