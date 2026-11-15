const MS_PER_DAY = 86_400_000;
const UNIX_EPOCH_JULIAN_DAY = 2_440_587.5;
const J2000_JULIAN_DAY = 2_451_545;
const DAYS_PER_CENTURY = 36_525;

/** Returns the number of Julian centuries between the J2000 epoch and the given Unix timestamp (ms). */
export const centuriesSinceJ2000 = (timestamp: number) =>
  (timestamp / MS_PER_DAY + UNIX_EPOCH_JULIAN_DAY - J2000_JULIAN_DAY) / DAYS_PER_CENTURY;
