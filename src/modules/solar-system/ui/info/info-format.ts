const LOCALE = 'en-GB';
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;
const THOUSAND = 1000;
const SIGNIFICANT_DIGITS = 3;
const LIGHT_SPEED_KM_PER_S = 299_792.458;
const CAR_SPEED_KM_PER_H = 100;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_YEAR = 365.25;
const MAX_YEARS_SHOWN_AS_DAYS = 2;
const MAX_HOURS_SHOWN_AS_HOURS = 48;

const significant = (value: number) =>
  Number(value.toPrecision(SIGNIFICANT_DIGITS)).toLocaleString(LOCALE);

/** Formats a distance: "406,000 km", "148 million km", "4.47 billion km". */
export const formatDistance = (km: number): string => {
  if (km >= BILLION) return `${significant(km / BILLION)} billion km`;
  if (km >= MILLION) return `${significant(km / MILLION)} million km`;
  return `${(Math.round(km / THOUSAND) * THOUSAND).toLocaleString(LOCALE)} km`;
};

/** Formats how long light takes to travel the distance: "1.4 s", "8 min 14 s", "4 h 3 min". */
export const formatLightTime = (km: number): string => {
  const seconds = km / LIGHT_SPEED_KM_PER_S;
  if (seconds < SECONDS_PER_MINUTE) return `${significant(seconds)} s`;
  if (seconds < SECONDS_PER_HOUR) {
    const wholeSeconds = Math.round(seconds);
    return `${Math.floor(wholeSeconds / SECONDS_PER_MINUTE)} min ${wholeSeconds % SECONDS_PER_MINUTE} s`;
  }
  const wholeMinutes = Math.round(seconds / SECONDS_PER_MINUTE);
  return `${Math.floor(wholeMinutes / MINUTES_PER_HOUR)} h ${wholeMinutes % MINUTES_PER_HOUR} min`;
};

/** Formats a number of days, in days up to two years: "88 days", "687 days", "11.9 years". */
export const formatDays = (days: number): string =>
  days < MAX_YEARS_SHOWN_AS_DAYS * DAYS_PER_YEAR
    ? `${significant(days)} days`
    : `${significant(days / DAYS_PER_YEAR)} years`;

/** Formats how long a car at 100 km/h would take to drive the distance non-stop. */
export const formatCarTime = (km: number): string =>
  formatDays(km / CAR_SPEED_KM_PER_H / HOURS_PER_DAY);

/** Formats a rotation period: "23 h 56 min", "58.6 days". */
export const formatDayLength = (hours: number): string => {
  const length = Math.abs(hours);
  if (length > MAX_HOURS_SHOWN_AS_HOURS) return formatDays(length / HOURS_PER_DAY);
  const wholeMinutes = Math.round(length * MINUTES_PER_HOUR);
  return `${Math.floor(wholeMinutes / MINUTES_PER_HOUR)} h ${wholeMinutes % MINUTES_PER_HOUR} min`;
};

/** Formats a size compared to the Earth: "109 times", "0.27 times". */
export const formatTimesEarth = (ratio: number): string => `${significant(ratio)} times`;
