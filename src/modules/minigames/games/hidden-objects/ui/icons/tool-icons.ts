/** Drawings of the hand tools, in a 20 by 20 box centered on 0. */

export const WRENCH_ICON = `
  <line x1="-7" y1="7" x2="3" y2="-3" stroke="#b8c2d6" stroke-width="3.4" stroke-linecap="round"/>
  <circle cx="5" cy="-5" r="4.6" fill="#b8c2d6"/>
  <rect x="3.6" y="-11" width="2.8" height="6" fill="#141a30" transform="rotate(45 5 -5)"/>`;

export const SCREWDRIVER_ICON = `
  <g transform="rotate(45)">
    <rect x="-0.9" y="-1" width="1.8" height="10.5" fill="#c9d1e0"/>
    <rect x="-3" y="-10" width="6" height="10" rx="2.4" fill="#ff6b3d"/>
    <line x1="0" y1="-8" x2="0" y2="-2" stroke="#ffa27f" stroke-width="1"/>
  </g>`;

export const HAMMER_ICON = `
  <rect x="-1.4" y="-4" width="2.8" height="14" rx="1" fill="#a86b3c"/>
  <rect x="-8" y="-9" width="16" height="6" rx="1.2" fill="#7d8aa8"/>
  <rect x="5" y="-9" width="3" height="6" fill="#5a6684"/>`;

export const BOLT_ICON = `
  <rect x="-1.8" y="-3" width="3.6" height="12" fill="#9aa8d1"/>
  <path d="M-1.8 0 H1.8 M-1.8 3 H1.8 M-1.8 6 H1.8" stroke="#5a6684" stroke-width="0.8"/>
  <polygon points="-6,-6 -3,-10 3,-10 6,-6 3,-2 -3,-2" fill="#c9d1e0"/>`;

export const GEAR_ICON = `
  <circle r="7.4" fill="none" stroke="#e0b84a" stroke-width="3.4" stroke-dasharray="2.4 2.4"/>
  <circle r="6" fill="#e0b84a"/>
  <circle r="2.2" fill="#141a30"/>`;

export const TAPE_ICON = `
  <circle r="8.5" fill="#cfd6e4"/>
  <circle r="8.5" fill="none" stroke="#9aa8d1" stroke-width="1"/>
  <circle r="4" fill="#141a30"/>
  <path d="M6 5 L10 9 L7 10 Z" fill="#cfd6e4"/>`;
