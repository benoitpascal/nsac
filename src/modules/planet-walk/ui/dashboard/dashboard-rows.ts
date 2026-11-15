import { WORLD_CONDITIONS } from '../../core/station/conditions';
import { batteryShare } from '../../core/excavator/excavator-power';
import type { ExcavatorStore } from '../../core/excavator/excavator-power';
import type { StationReadings } from '../../core/station/readings';

/** A line of the dashboard: what is measured, and its value as shown. */
export type DashboardRow = { label: string; value: string };

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const PERCENT = 100;
const EARTH_RADIATION = WORLD_CONDITIONS.earth.radiationMicroSvPerHour;

const tenths = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const time = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const twoDigits = (value: number) => String(value).padStart(2, '0');

/** The local day as a 24-hour sun clock: 12:00 when the Sun is highest. */
const sunClock = (dayShare: number) => {
  const minutes = Math.floor(dayShare * HOURS_PER_DAY * MINUTES_PER_HOUR);
  return `${twoDigits(Math.floor(minutes / MINUTES_PER_HOUR))}:${twoDigits(minutes % MINUTES_PER_HOUR)}`;
};

/** Returns the dashboard lines for the readings, with their units. */
export const dashboardRows = (readings: StationReadings): DashboardRow[] => {
  const charging = readings.generationKw >= readings.loadKw;
  const radiation = readings.radiationMicroSvPerHour;
  return [
    {
      label: 'Oxygen',
      value: `${tenths.format(readings.oxygenKg)} kg · ${whole.format(readings.oxygenDays)} days for 4 people`,
    },
    {
      label: 'Food',
      value: `${tenths.format(readings.foodKg)} kg · ${whole.format(readings.foodDays)} days for 4 people`,
    },
    { label: 'Solar power', value: `${tenths.format(readings.generationKw)} kW made` },
    { label: 'Power use', value: `${tenths.format(readings.loadKw)} kW used` },
    {
      label: 'Battery',
      value: `${tenths.format(readings.batteryShare * PERCENT)} % · ${charging ? 'charging' : 'draining'}`,
    },
    { label: 'Water', value: `${tenths.format(readings.waterLiters)} L` },
    {
      label: 'Radiation outside',
      value: `${tenths.format(radiation)} µSv/h · ${whole.format(radiation / EARTH_RADIATION)}× Earth`,
    },
    { label: 'Date', value: date.format(readings.timestamp) },
    { label: 'Time (UTC)', value: time.format(readings.timestamp) },
    {
      label: 'Sun time here',
      value: `${sunClock(readings.dayShare)} · ${readings.daytime ? 'day' : 'night'}`,
    },
    { label: 'Outside temperature', value: `${whole.format(readings.outsideCelsius)} °C` },
  ];
};

/** Returns the dashboard lines about the excavator robot: its battery, its load and what it dropped off. */
export const excavatorRows = (store: ExcavatorStore): DashboardRow[] => [
  { label: 'Excavator battery', value: `${tenths.format(batteryShare(store) * PERCENT)} %` },
  { label: 'Regolith on board', value: `${tenths.format(store.carriedKg)} kg` },
  { label: 'Regolith delivered', value: `${tenths.format(store.deliveredKg)} kg` },
];
