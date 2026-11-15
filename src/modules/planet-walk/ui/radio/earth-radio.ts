import { EARTH_RADIO_LINES, EARTH_RADIO_SPEECH } from '../../core/sky/earth-radio-lines';
import type { RadioMessage } from './radio-message';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export type EarthRadioOptions = {
  now: () => number;
  /** Whether the message was already heard on that game day (YYYY-MM-DD). */
  heard: (day: string) => boolean;
  markHeard: (day: string) => void;
};

/**
 * The first time each game day the astronaut walks out of the base, the radio crackles and the base
 * reminds them that the sky is real: the Earth stands high above the base and never moves.
 */
export const createEarthRadio = (radio: RadioMessage, options: EarthRadioOptions) => {
  let wasOut = false;
  return {
    update: (wentOut: boolean) => {
      const steppedOut = wentOut && !wasOut;
      wasOut = wentOut;
      const day = new Date(options.now()).toISOString().slice(0, 10);
      if (!steppedOut || options.heard(day)) return;
      options.markHeard(day);
      radio.say(
        `📻 Radio · Base · ${dateFormat.format(options.now())}`,
        EARTH_RADIO_LINES,
        EARTH_RADIO_SPEECH,
      );
    },
  };
};
