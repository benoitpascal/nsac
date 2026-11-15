import type { SkyEvent, SkyEventPrecision } from '../core/sky-event';

const DAY_FORMAT = { day: 'numeric', month: 'short', year: 'numeric' } as const;
const DATE_FORMATS: Record<SkyEventPrecision, Intl.DateTimeFormat> = {
  minute: new Intl.DateTimeFormat('en-GB', { ...DAY_FORMAT, hour: '2-digit', minute: '2-digit' }),
  day: new Intl.DateTimeFormat('en-GB', DAY_FORMAT),
};
const ITEM_CLASS = 'events__item';
const ISO_DATE_LENGTH = 10;

const createEventItem = (event: SkyEvent, onSelect: () => void) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${ITEM_CLASS} ${ITEM_CLASS}--${event.kind}`;
  const title = document.createElement('strong');
  title.textContent = event.title;
  const date = document.createElement('time');
  const isoMoment = new Date(event.timestamp).toISOString();
  date.dateTime = event.precision === 'day' ? isoMoment.slice(0, ISO_DATE_LENGTH) : isoMoment;
  date.textContent = DATE_FORMATS[event.precision].format(event.timestamp);
  const description = document.createElement('span');
  description.textContent = event.description;
  button.append(title, date, description);
  button.addEventListener('click', onSelect);
  const item = document.createElement('li');
  item.append(button);
  return item;
};

/**
 * Fills the panel with the clickable list of events, opened and closed by the toggle button.
 * Picking an event closes the list and reports it.
 */
export const mountEventsList = (
  toggle: HTMLButtonElement,
  panel: HTMLElement,
  events: readonly SkyEvent[],
  onSelect: (event: SkyEvent) => void,
) => {
  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };
  const list = document.createElement('ol');
  list.append(
    ...events.map((event) =>
      createEventItem(event, () => {
        setOpen(false);
        onSelect(event);
      }),
    ),
  );
  panel.replaceChildren(list);
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  setOpen(false);
};
