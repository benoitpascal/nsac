import type { Quality, Stocks } from '../core/campaign';
import type { ActionId } from '../core/actions';

/** How each stock is named and counted on screen. */
export const STOCK_TEXTS: Record<keyof Stocks, { name: string; unit: string }> = {
  energy: { name: 'Power', unit: '%' },
  oxygen: { name: 'Oxygen', unit: '%' },
  water: { name: 'Water', unit: '%' },
  food: { name: 'Food', unit: '%' },
  materials: { name: 'Materials', unit: ' units' },
  regolith: { name: 'Regolith', unit: ' units' },
  knowledge: { name: 'Knowledge', unit: ' pts' },
};

/** The two mini-games of the demo: what the player does, and why. */
export const CHALLENGE_TEXTS = {
  calibration: {
    title: 'Calibrate the 3D printer',
    story:
      'The printer melts regolith into bricks with a laser. ' +
      'Turn the mirrors so the laser reaches every target. Fewer moves, better bricks!',
  },
  shelter: {
    title: 'Build the shelter',
    story:
      'Hang every weight on the crane arm, and keep the arm level. ' + 'Fewer moves, less waste!',
  },
};

/** What each quality means for each mini-game. */
export const QUALITY_TEXTS: Record<'calibration' | 'shelter', Record<Quality, string>> = {
  calibration: {
    optimal: 'Perfect tuning: the printer wastes no regolith.',
    partial: 'Good enough: the printer wastes some regolith.',
    failed: 'Badly tuned: the printer wastes most of the regolith.',
  },
  shelter: {
    optimal: 'The shelter is finished, with very little waste.',
    partial: 'The shelter is finished, but it used extra materials.',
    failed: 'The shelter is not finished, and some materials were lost.',
  },
};

/** What each day 2 action does, in one short line. */
export const ACTION_TEXTS: Record<ActionId, { title: string; text: string }> = {
  shelter: { title: 'Build a shelter', text: 'Thick walls to protect the crew from danger.' },
  workshop: { title: 'Improve the workshop', text: 'Better printers make more materials.' },
  greenhouse: { title: 'Grow the greenhouse', text: 'More plants for more food later.' },
  research: { title: 'Invest in research', text: 'Study the Moon to prepare for Mars.' },
};

/** What a note of the day says in the debrief. */
export const NOTE_TEXTS: Record<string, string> = {
  robotBack: 'The robot brought its regolith back to the base.',
  robotStranded: 'The robot ran out of power. Towing it back took one more day.',
  'calibration:optimal': QUALITY_TEXTS.calibration.optimal,
  'calibration:partial': QUALITY_TEXTS.calibration.partial,
  'calibration:failed': QUALITY_TEXTS.calibration.failed,
  'action:shelter': 'You chose to build a shelter.',
  'action:workshop': 'You improved the workshop.',
  'action:greenhouse': 'You grew the greenhouse.',
  'action:research': 'You invested in research.',
  'shelter:optimal': QUALITY_TEXTS.shelter.optimal,
  'shelter:partial': QUALITY_TEXTS.shelter.partial,
  'shelter:failed': QUALITY_TEXTS.shelter.failed,
};
