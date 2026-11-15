import { startLightsOut } from './ui/lights-out.view';
import type { MiniGame } from '../../core/minigame';

/** Lights Out: switch off every light of the control panel to save the station's power. */
export const lightsOutGame: MiniGame = {
  id: 'lights-out',
  title: 'Lights Out',
  summary: "Switch off every light on the panel to save the station's power.",
  howTo: [
    'Tap a light: it and its four neighbours switch on or off.',
    'Switch off every light on the panel.',
    'Fewer moves give a better score.',
  ],
  start: (container, finish) => startLightsOut(container, finish, Math.random),
};
