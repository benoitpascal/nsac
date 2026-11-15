import type { FocusId } from './spacecraft/spacecraft-ids';

export type SkyEventKind = 'eclipse' | 'planets' | 'space-history';

/** Whether the event's time of day is known, or only its date. */
export type SkyEventPrecision = 'minute' | 'day';

/** A notable moment to travel to, and the body to look at then. */
export type SkyEvent = {
  title: string;
  description: string;
  kind: SkyEventKind;
  timestamp: number;
  precision: SkyEventPrecision;
  focus: FocusId;
};

const LOCAL_NOON = 12;

/** A moment known to the minute, given in UTC. */
export const at = (year: number, month: number, day: number, hour: number, minute: number) => ({
  timestamp: Date.UTC(year, month - 1, day, hour, minute),
  precision: 'minute' as const,
});

/** A moment only known by its date, placed at local noon. */
export const onDay = (year: number, month: number, day: number) => ({
  timestamp: new Date(year, month - 1, day, LOCAL_NOON).getTime(),
  precision: 'day' as const,
});
