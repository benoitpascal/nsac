import { bearingDegrees, COMPASS_POINTS } from '../../core/hud/compass';
import { footprintOnMap, middleOf, toMap } from '../../core/hud/minimap';
import { diamond, house, MAP_COLORS, trace } from './walk-map-pictos';
import type { Footprint, MapCenter, MapFrame } from '../../core/hud/minimap';
import type { Spot } from '../../core/obstacles';

/** What the map marks besides the buildings: the regolith zones, the robot and the base hall. */
export type MapSites = {
  digZone: Footprint;
  dropZone: Footprint;
  hall: Spot;
  robot: () => Spot;
};

export type WalkMapElements = {
  hud: HTMLElement;
  canvas: HTMLCanvasElement;
  compass: HTMLElement;
};

/** The map shows 45 m around the walker, as close as the mock-up's map. */
const FRAME: MapFrame = { sizePx: 260, rangeM: 45 };
const COLORS = MAP_COLORS;
/** Pixels of the compass tape per degree turned. */
const TAPE_PX_PER_DEGREE = 2.4;

/** Builds the tape of the compass: the eight points, twice round so it can slide either way. */
const fillTape = (tape: HTMLElement) => {
  const marks = [...COMPASS_POINTS, ...COMPASS_POINTS, ...COMPASS_POINTS].map((label, index) => {
    const mark = document.createElement('span');
    mark.className = 'walk-compass__mark';
    mark.textContent = label;
    mark.style.left = `${index * 45 * TAPE_PX_PER_DEGREE}px`;
    return mark;
  });
  tape.replaceChildren(...marks);
};

/**
 * The outdoor part of the Figma HUD: a heading tape at the bottom and a round map turning with the
 * astronaut, who always faces its top. Buildings are cyan blocks, the dig zone has a yellow
 * diamond, the drop-off zone is red, the robot a cyan dot and the base hall a house. Shown only
 * while the view is outside.
 */
export const createWalkMap = (
  elements: WalkMapElements,
  footprints: readonly Footprint[],
  sites: MapSites,
) => {
  const context = elements.canvas.getContext('2d');
  fillTape(elements.compass);
  const area = (center: MapCenter, footprint: Footprint, fill: string, edge?: string) => {
    const corners = context && footprintOnMap(FRAME, center, footprint);
    if (!context || !corners) return;
    trace(context, corners);
    context.fillStyle = fill;
    context.fill();
    if (!edge) return;
    context.strokeStyle = edge;
    context.lineWidth = 1;
    context.stroke();
  };
  const draw = (center: MapCenter) => {
    if (!context) return;
    context.clearRect(0, 0, FRAME.sizePx, FRAME.sizePx);
    context.fillStyle = COLORS.ground;
    context.fillRect(0, 0, FRAME.sizePx, FRAME.sizePx);
    area(center, sites.digZone, COLORS.dig, COLORS.diamond);
    area(center, sites.dropZone, COLORS.drop, COLORS.pink);
    footprints.forEach((footprint) => area(center, footprint, COLORS.building, COLORS.edge));
    house(context, toMap(FRAME, center, sites.hall));
    diamond(context, toMap(FRAME, center, middleOf(sites.digZone)));
    const robot = toMap(FRAME, center, sites.robot());
    context.beginPath();
    context.arc(robot.x, robot.y, 6, 0, 2 * Math.PI);
    context.fillStyle = COLORS.cyan;
    context.fill();
    context.strokeStyle = COLORS.ink;
    context.lineWidth = 2;
    context.stroke();
  };
  return {
    /** Redraws the map and the compass around who the camera follows, or hides them indoors. */
    update: (followed: MapCenter, outside: boolean) => {
      elements.hud.hidden = !outside;
      if (!outside) return;
      draw(followed);
      // The tape starts one full turn in, so it can slide left or right without running out.
      const offset = (360 + bearingDegrees(followed.heading)) * TAPE_PX_PER_DEGREE;
      elements.compass.style.transform = `translateX(${-offset}px)`;
    },
  };
};
