/**
 * Downloads spacecraft trajectories from the NASA/JPL Horizons API and writes them to
 * public/data/trajectories/<mission>.json, as [ms UTC, x, y, z, ...] in km (J2000 ecliptic),
 * from the Sun's center or the Earth's. Samples every few days, and every day around launch
 * and planet encounters. Run by hand: pnpm data:trajectories
 */
import { writeFile } from 'node:fs/promises';

type Request = {
  id: string;
  command: string;
  center: 'sun' | 'earth';
  start: string;
  stop: string;
  stepDays: number;
  /** Dates (YYYY-MM-DD) around which the path is sampled every day. */
  closeUps: string[];
  /** Date (YYYY-MM-DD) from which the path is sampled every day until the end. */
  dailyFrom?: string;
};

const API = 'https://ssd.jpl.nasa.gov/api/horizons.api';
const CENTERS = { sun: '500@10', earth: '500@399' };
const CLOSE_UP_DAYS = 30;
const MS_PER_DAY = 86_400_000;
const UNIX_EPOCH_JULIAN_DAY = 2_440_587.5;
const OUTPUT = 'public/data/trajectories';
const FORECAST_LIMIT = '2030-01-01';

const REQUESTS: Request[] = [
  {
    id: 'curiosity',
    command: '-76',
    center: 'sun',
    start: '2011-11-26 15:02',
    stop: '2012-08-06 05:17',
    stepDays: 2,
    closeUps: ['2011-11-26', '2012-08-06'],
  },
  {
    id: 'jwst',
    command: '-170',
    center: 'earth',
    start: '2021-12-25 12:20',
    stop: FORECAST_LIMIT,
    stepDays: 2,
    closeUps: ['2021-12-25'],
  },
  {
    id: 'voyager-1',
    command: '-31',
    center: 'sun',
    start: '1977-09-05 12:56',
    stop: FORECAST_LIMIT,
    stepDays: 10,
    closeUps: ['1977-09-05', '1979-03-05', '1980-11-12'],
  },
  {
    id: 'voyager-2',
    command: '-32',
    center: 'sun',
    start: '1977-08-20 14:29',
    stop: FORECAST_LIMIT,
    stepDays: 10,
    closeUps: ['1977-08-20', '1979-07-09', '1981-08-26', '1986-01-24', '1989-08-25'],
  },
  {
    id: 'cassini',
    command: '-82',
    center: 'sun',
    start: '1997-10-15 08:43',
    stop: '2017-09-15 10:31',
    stepDays: 5,
    closeUps: ['1997-10-15', '1998-04-26', '1999-06-24', '1999-08-18', '2000-12-30'],
    dailyFrom: '2004-06-01',
  },
  {
    id: 'new-horizons',
    command: '-98',
    center: 'sun',
    start: '2006-01-19 19:00',
    stop: FORECAST_LIMIT,
    stepDays: 10,
    closeUps: ['2006-01-19', '2007-02-28', '2015-07-14', '2019-01-01'],
  },
];

const COVERAGE_PATTERN = /(prior to|after) A\.D\. (\d{4})-([A-Z]{3})-(\d{2}) (\d{2}:\d{2})/;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const toHorizonsTime = (ms: number) => new Date(ms).toISOString().slice(0, 16).replace('T', ' ');

/** Fetches [ms, x, y, z] rows, narrowing the range to the available ephemeris when needed. */
const fetchRows = async (
  request: Request,
  start: number,
  stop: number,
  stepDays: number,
): Promise<number[][]> => {
  const parameters = new URLSearchParams({
    format: 'json',
    COMMAND: `'${request.command}'`,
    OBJ_DATA: "'NO'",
    EPHEM_TYPE: "'VECTORS'",
    CENTER: `'${CENTERS[request.center]}'`,
    START_TIME: `'${toHorizonsTime(start)}'`,
    STOP_TIME: `'${toHorizonsTime(stop)}'`,
    STEP_SIZE: `'${stepDays} d'`,
    VEC_TABLE: "'1'",
    REF_PLANE: "'ECLIPTIC'",
    REF_SYSTEM: "'ICRF'",
    CSV_FORMAT: "'YES'",
    OUT_UNITS: "'KM-S'",
  });
  const response = (await (await fetch(`${API}?${parameters}`)).json()) as {
    result?: string;
    error?: string;
  };
  const coverage = response.error?.match(COVERAGE_PATTERN);
  if (coverage) {
    const [, side, year, month, day, time] = coverage;
    const limit = Date.parse(
      `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, '0')}-${day}T${time}Z`,
    );
    return side === 'prior to'
      ? fetchRows(request, limit + 60_000, stop, stepDays)
      : fetchRows(request, start, limit - 60_000, stepDays);
  }
  if (!response.result) throw new Error(`${request.id}: ${response.error ?? 'no result'}`);
  const table = response.result.split('$$SOE')[1]?.split('$$EOE')[0] ?? '';
  return table
    .trim()
    .split('\n')
    .map((line) => {
      const [julianDay, , x, y, z] = line.split(',').map((cell) => cell.trim());
      return [
        Math.round((Number(julianDay) - UNIX_EPOCH_JULIAN_DAY) * MS_PER_DAY),
        Number(x),
        Number(y),
        Number(z),
      ];
    });
};

const fetchMission = async (request: Request) => {
  const start = Date.parse(`${request.start.replace(' ', 'T')}Z`);
  const stop = Date.parse(`${request.stop.replace(' ', 'T')}Z`);
  const rows = await fetchRows(request, start, stop, request.stepDays);
  for (const closeUp of request.closeUps) {
    const middle = Date.parse(`${closeUp}T00:00Z`);
    const from = Math.max(start, middle - CLOSE_UP_DAYS * MS_PER_DAY);
    const to = Math.min(stop, middle + CLOSE_UP_DAYS * MS_PER_DAY);
    rows.push(...(await fetchRows(request, from, to, 1)));
  }
  if (request.dailyFrom)
    rows.push(...(await fetchRows(request, Date.parse(`${request.dailyFrom}T00:00Z`), stop, 1)));
  const unique = new Map(rows.map((row) => [row[0], row]));
  const sorted = [...unique.values()].sort((a, b) => a[0] - b[0]);
  const samples = sorted.flatMap(([time, x, y, z]) => [
    time,
    Math.round(x),
    Math.round(y),
    Math.round(z),
  ]);
  await writeFile(
    `${OUTPUT}/${request.id}.json`,
    JSON.stringify({ id: request.id, center: request.center, samples }),
  );
  console.log(`${request.id}: ${sorted.length} samples`);
};

for (const request of REQUESTS) await fetchMission(request);
