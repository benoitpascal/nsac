import { ACT_DAYS } from '../core/campaign';
import { element } from './element';
import { NOTE_TEXTS, STOCK_TEXTS } from './texts';
import type { Campaign, DayResult, Stocks } from '../core/campaign';

const signed = (value: number) => (value > 0 ? `+${value}` : String(value));

/** One line per stock: its value tonight and how much the day gained or used. */
const stockRows = ({ before, after }: DayResult) =>
  (Object.keys(STOCK_TEXTS) as (keyof Stocks)[])
    .filter((key) => key !== 'regolith')
    .map((key) => {
      const { name, unit } = STOCK_TEXTS[key];
      const change = after[key] - before[key];
      const row = element('li', 'debrief-stock');
      row.dataset.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'same';
      row.append(
        element('span', 'debrief-stock__name', name),
        element('span', 'debrief-stock__value', `${after[key]}${unit}`),
        element('span', 'debrief-stock__change', change === 0 ? '=' : `${signed(change)}${unit}`),
      );
      return row;
    });

/**
 * Shows the end of a day: what happened, every stock with what the day gained or used, the
 * knowledge gathered, and the days left in the act; its button starts the next day.
 */
export const renderDebrief = (
  elements: { day: HTMLElement; notes: HTMLElement; stocks: HTMLElement; time: HTMLElement },
  campaign: Campaign,
) => {
  const result = campaign.lastDay;
  if (!result) return;
  elements.day.textContent = String(result.day).padStart(2, '0');
  elements.notes.replaceChildren(
    ...result.notes.map((note) => element('li', 'debrief-note', NOTE_TEXTS[note] ?? note)),
    element(
      'li',
      'debrief-note',
      'Overnight the crew breathed, drank and ate, and the base used power.',
    ),
  );
  elements.stocks.replaceChildren(...stockRows(result));
  const recovery = result.notes.includes('robotStranded') ? 1 : 0;
  const daysLeft = ACT_DAYS - result.day - recovery;
  elements.time.textContent = `${daysLeft} of ${ACT_DAYS} days left to get ready for Mars.`;
};
