import { newCampaign } from './campaign';
import { dayClosingPages } from './day-closing';
import { debriefPages } from './debrief-text';
import type { Quality } from './quality';
import type { Act, GuidePage } from './scenario-content';

const VERDICTS = ['efficient', 'wasteful', 'unfinished'] as const;
const QUALITIES: Quality[] = ['optimal', 'partial', 'failed'];

/** Everything the mascot can say on a page: its text, then the replies or answer explanations. */
const pageLines = (page: GuidePage): string[] => {
  if (page.kind === 'text') return [page.text];
  if (page.kind === 'choice')
    return [page.text, ...page.options.flatMap((option) => option.reply.flatMap(pageLines))];
  return [page.text, ...page.answers.map((answer) => answer.explanation)];
};

/** Every debrief line that does not depend on the amounts used (that one stays silent). */
const debriefLines = (act: Act) =>
  act.days.flatMap((day) =>
    day.missions.flatMap((mission) =>
      VERDICTS.flatMap((verdict) =>
        QUALITIES.flatMap((shelterQuality) =>
          debriefPages({
            missionId: mission.id,
            verdict,
            objectiveShare: 0,
            used: {},
            details: { rescued: 1 },
            shelterQuality,
          }).flatMap(pageLines),
        ),
      ),
    ),
  );

/**
 * End-of-day lines that never change: the night alone, and the replies to the printer choice.
 * The printer day's summary and question give the player's own amounts, so they stay silent.
 */
const closingLines = (act: Act) =>
  act.days.flatMap((day) => {
    const pages = dayClosingPages(newCampaign(0), day);
    if (day.closing === 'night') return pages.flatMap(pageLines);
    return pages.flatMap((page) =>
      page.kind === 'choice'
        ? page.options.flatMap((option) => option.reply.flatMap(pageLines))
        : [],
    );
  });

/** Returns each line of the act the mascot says aloud, once, for the voice generation script. */
export const actVoiceLines = (act: Act) => {
  const scripted = [
    ...act.days.flatMap((day) => [
      ...day.opening,
      ...day.missions.flatMap((mission) => [...mission.briefing, ...mission.academy]),
    ]),
    ...act.ending,
  ].flatMap(pageLines);
  return [...new Set([...scripted, ...debriefLines(act), ...closingLines(act)])];
};
