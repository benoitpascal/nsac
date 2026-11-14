const LOCALE = 'en-GB';
const SECONDS_PER_HOUR = 3600;
const SPEED_STEP_KM_PER_H = 100;
const HOURS_PER_DAY = 24;
const LAUNCH_DATE = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats a launch date: "20 November 1998". */
export const formatLaunchDate = (timestamp: number): string => LAUNCH_DATE.format(timestamp);

/** Formats an altitude to the kilometre: "421 km". */
export const formatAltitude = (km: number): string => `${Math.round(km).toLocaleString(LOCALE)} km`;

/** Formats a speed given in km/s as km/h, to the hundred: "27,600 km/h". */
export const formatSpeed = (kmPerS: number): string => {
  const kmPerH =
    Math.round((kmPerS * SECONDS_PER_HOUR) / SPEED_STEP_KM_PER_H) * SPEED_STEP_KM_PER_H;
  return `${kmPerH.toLocaleString(LOCALE)} km/h`;
};

/** Formats how many orbits fit in a day: "15.5 times a day". */
export const formatTurnsPerDay = (periodHours: number): string =>
  `${(Math.round((HOURS_PER_DAY / periodHours) * 10) / 10).toLocaleString(LOCALE)} times a day`;
