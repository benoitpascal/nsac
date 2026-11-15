import type { ItemColour, ItemKind } from '../core/items';

const SVG_NS = 'http://www.w3.org/2000/svg';
const HOLE = 'class="mg-flash-observation-hole"';

/** Drawing of each kind, in a 64 x 64 box, filled with the current colour. */
const SHAPES: Record<ItemKind, string> = {
  planet:
    '<circle cx="32" cy="32" r="17"/><ellipse cx="32" cy="32" rx="29" ry="8" fill="none" ' +
    'stroke="currentColor" stroke-width="4" transform="rotate(-20 32 32)"/>',
  star: '<polygon points="32,4 40,24 62,24 44,38 51,60 32,46 13,60 20,38 2,24 24,24"/>',
  rocket:
    '<path d="M32 4C44 14 46 30 42 46H22C18 30 20 14 32 4Z"/>' +
    '<path d="M22 32L11 50L22 46ZM42 32L53 50L42 46ZM26 49L32 61L38 49Z"/>' +
    `<circle cx="32" cy="24" r="5" ${HOLE}/>`,
  satellite:
    '<rect x="23" y="23" width="18" height="18" rx="3"/><rect x="2" y="25" width="17" height="14"/>' +
    '<rect x="45" y="25" width="17" height="14"/><rect x="18" y="30" width="28" height="4"/>' +
    '<rect x="30" y="12" width="4" height="12"/><circle cx="32" cy="10" r="5"/>',
  moon: '<path d="M38 5A27 27 0 1 0 59 44A21 21 0 1 1 38 5Z"/>',
  comet:
    '<path d="M36 14L3 56L50 30Z" opacity="0.55"/><circle cx="45" cy="20" r="13"/>' +
    `<circle cx="41" cy="16" r="3" ${HOLE}/>`,
};

/** Draws an item of the kind, in the colour when given, otherwise in plain ink. */
export const drawItem = (kind: ItemKind, colour?: ItemColour): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('mg-flash-observation-item', `mg-flash-observation--${colour ?? 'ink'}`);
  svg.innerHTML = SHAPES[kind];
  return svg;
};
