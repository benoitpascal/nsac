import { el } from './dom';
import type { Voice } from '../core/voice';

/** A kind of sound the player can turn off apart from the voices. */
type SoundChannel = 'effects' | 'music';

export type SettingsDeps = {
  voice?: Voice;
  /** Whether the sound effects and the music are off, and how to change it. */
  sound: {
    isMuted: (channel: SoundChannel) => boolean;
    setMuted: (channel: SoundChannel, muted: boolean) => void;
  };
  /** The view the 3D base starts in: through the astronaut's eyes, or from behind them. */
  view: { get: () => 'first' | 'third'; set: (view: 'first' | 'third') => void };
};

/** One setting: its name and line on the left, an on / off switch on the right. */
const switchRow = (name: string, text: string, isOn: boolean, onToggle: (on: boolean) => void) => {
  const row = el('li', 'settings__row');
  const words = el('span', 'settings__words');
  const label = el('span', 'settings__name', name);
  label.id = `setting-${name.toLowerCase().replace(/\W+/g, '-')}`;
  words.append(label, el('span', 'settings__text', text));
  const toggle = el('button', 'settings__switch');
  toggle.type = 'button';
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-labelledby', label.id);
  const draw = (on: boolean) => {
    toggle.setAttribute('aria-checked', String(on));
    toggle.dataset.state = on ? 'On' : 'Off';
  };
  draw(isOn);
  toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-checked') !== 'true';
    draw(on);
    onToggle(on);
  });
  row.append(words, toggle);
  return row;
};

/** The game's settings as on / off switches: voices, sound effects, music, first person view. */
export const renderSettings = (deps: SettingsDeps) => {
  const list = el('ul', 'settings');
  list.append(
    switchRow(
      'Voices',
      'The robot assistant and the radio read their messages aloud.',
      !(deps.voice?.isMuted() ?? false),
      (on) => deps.voice?.setMuted(!on),
    ),
    switchRow(
      'Sound effects',
      'A click on each button, a chime when you complete a goal.',
      !deps.sound.isMuted('effects'),
      (on) => deps.sound.setMuted('effects', !on),
    ),
    switchRow(
      'Music',
      'Music on the home page and during the mini-games.',
      !deps.sound.isMuted('music'),
      (on) => deps.sound.setMuted('music', !on),
    ),
    switchRow(
      'First person view',
      "In the base, you start seeing through the astronaut's eyes. Off: you see them from behind. V switches in the game.",
      deps.view.get() === 'first',
      (on) => deps.view.set(on ? 'first' : 'third'),
    ),
  );
  return list;
};
