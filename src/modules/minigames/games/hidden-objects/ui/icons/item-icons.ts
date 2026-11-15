import {
  ANTENNA_ICON,
  BATTERY_ICON,
  FLASHLIGHT_ICON,
  HELMET_ICON,
  KEY_CARD_ICON,
} from './gear-icons';
import { BULB_ICON, CUP_ICON, GLOVE_ICON, MAGNET_ICON, PLANT_ICON } from './home-icons';
import {
  BOLT_ICON,
  GEAR_ICON,
  HAMMER_ICON,
  SCREWDRIVER_ICON,
  TAPE_ICON,
  WRENCH_ICON,
} from './tool-icons';
import type { ItemKind } from '../../core/item-kinds';

/** Side of the box every icon is drawn in, centered on 0. */
export const ICON_BOX = 20;

/** How each kind of object looks and the word shown under it in the list. */
export const ITEM_ICONS: Record<ItemKind, { markup: string; word: string }> = {
  wrench: { markup: WRENCH_ICON, word: 'Wrench' },
  helmet: { markup: HELMET_ICON, word: 'Helmet' },
  battery: { markup: BATTERY_ICON, word: 'Battery' },
  screwdriver: { markup: SCREWDRIVER_ICON, word: 'Screwdriver' },
  keyCard: { markup: KEY_CARD_ICON, word: 'Key card' },
  flashlight: { markup: FLASHLIGHT_ICON, word: 'Flashlight' },
  plant: { markup: PLANT_ICON, word: 'Plant' },
  cup: { markup: CUP_ICON, word: 'Cup' },
  glove: { markup: GLOVE_ICON, word: 'Glove' },
  bolt: { markup: BOLT_ICON, word: 'Bolt' },
  antenna: { markup: ANTENNA_ICON, word: 'Antenna' },
  magnet: { markup: MAGNET_ICON, word: 'Magnet' },
  hammer: { markup: HAMMER_ICON, word: 'Hammer' },
  gear: { markup: GEAR_ICON, word: 'Gear' },
  tape: { markup: TAPE_ICON, word: 'Tape' },
  bulb: { markup: BULB_ICON, word: 'Bulb' },
};
