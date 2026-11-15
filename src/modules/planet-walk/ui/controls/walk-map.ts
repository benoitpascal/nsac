import { arrowTurn, footprintOnMap, toMap } from '../../core/map/minimap';
import type { Footprint, MapFrame } from '../../core/map/minimap';
import type { Spot } from '../../core/obstacles';

/** What the map shows besides the buildings: the regolith zones and the excavator robot. */
export type MapSites = { digZone: Footprint; dropZone: Footprint; robot: () => Spot };

export type WalkMapElements = {
  hud: HTMLElement;
  canvas: HTMLCanvasElement;
  arrow: HTMLElement;
  time: HTMLElement;
};

/** The map shows 65 m around the walker: the whole base when standing in its middle. */
const FRAME: MapFrame = { sizePx: 260, rangeM: 65 };
const COLORS = {
  ground: 'rgba(20, 28, 51, 0.6)',
  building: 'rgba(247, 245, 245, 0.45)',
  dig: 'rgba(249, 205, 95, 0.55)',
  drop: 'rgba(237, 95, 121, 0.55)',
  robot: '#35e9fd',
};
const ROBOT_RADIUS_PX = 5;
const TIME = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });

/**
 * The outdoor HUD of the Figma file: a round map centred on the astronaut, buildings in white,
 * the dig zone in yellow, the drop-off zone in red, the robot in cyan and an arrow for where the
 * astronaut faces, with the base clock above it. Shown only while the view is outside.
 */
export const createWalkMap = (
  elements: WalkMapElements,
  footprints: readonly Footprint[],
  sites: MapSites,
  now: () => number,
) => {
  const context = elements.canvas.getContext('2d');
  const fill = (center: Spot, footprint: Footprint, color: string) => {
    const rect = context && footprintOnMap(FRAME, center, footprint);
    if (!context || !rect) return;
    context.fillStyle = color;
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  };
  const draw = (center: Spot) => {
    if (!context) return;
    context.clearRect(0, 0, FRAME.sizePx, FRAME.sizePx);
    context.fillStyle = COLORS.ground;
    context.fillRect(0, 0, FRAME.sizePx, FRAME.sizePx);
    fill(center, sites.digZone, COLORS.dig);
    fill(center, sites.dropZone, COLORS.drop);
    footprints.forEach((footprint) => fill(center, footprint, COLORS.building));
    const robot = toMap(FRAME, center, sites.robot());
    context.fillStyle = COLORS.robot;
    context.beginPath();
    context.arc(robot.x, robot.z, ROBOT_RADIUS_PX, 0, 2 * Math.PI);
    context.fill();
  };
  return {
    /** Redraws the map around who the camera follows, or hides it while the view is indoors. */
    update: (followed: Spot & { heading: number }, outside: boolean) => {
      elements.hud.hidden = !outside;
      if (!outside) return;
      draw(followed);
      elements.arrow.style.transform = `rotate(${arrowTurn(followed.heading)}rad)`;
      const time = TIME.format(now());
      if (elements.time.textContent !== time) elements.time.textContent = time;
    },
  };
};
