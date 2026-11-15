/** Something that happens on a given day: a solar storm (with a choice), or the Sun hiding. */
export type DayEvent = 'storm' | 'shadow';

/** A day of the demo: the solar power the panels make on their own (kWh), and its event. */
export type DayScript = { solarKwh: number; event?: DayEvent };

/**
 * The five days the demo plays out of the 30-day campaign. Near the south pole the Sun stays low
 * and the crater rims cast long shadows, so one day the panels barely make any power.
 */
export const DEMO_DAYS: readonly DayScript[] = [
  { solarKwh: 220 },
  { solarKwh: 50, event: 'shadow' },
  { solarKwh: 220 },
  { solarKwh: 220, event: 'storm' },
  { solarKwh: 220 },
];

/** Length of the full campaign the demo is cut from (days). */
export const CAMPAIGN_DAYS = 30;

/**
 * The real solar storm the day 4 event is based on: a solar particle event seen near the Earth by
 * GOES and SOHO (NASA DONKI, archived, fetched 2026-11-14).
 */
export const STORM_SOURCE = {
  date: '10 September 2017',
  spacecraft: 'GOES and SOHO',
  dataset: 'NASA DONKI — solar energetic particles (archived)',
  url: 'https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/13101/-1',
};
