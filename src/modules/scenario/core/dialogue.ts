import type { ChoiceOption, DialogueEffect, GuidePage } from './scenario-content';

/**
 * Where the player stands in a dialogue: the page of the script, and the mascot's reply pages to
 * a choice still to show before going on to the page `after`, or ending with the option's effect.
 */
export type DialogueCursor = {
  index: number;
  replies: GuidePage[];
  after: number;
  effect?: DialogueEffect;
};

/** The dialogue is over, with what the last picked option asks the game to do, if anything. */
export type DialogueEnd = { end: true; effect?: DialogueEffect };

/** Returns the cursor on the first page of a dialogue. */
export const startDialogue = (): DialogueCursor => ({ index: 0, replies: [], after: 1 });

/** Returns the page to show. */
export const currentPage = (pages: readonly GuidePage[], cursor: DialogueCursor): GuidePage =>
  cursor.replies[0] ?? pages[cursor.index];

const indexOf = (pages: readonly GuidePage[], id: string | undefined, fallback: number) => {
  if (id === undefined) return fallback;
  const found = pages.findIndex((page) => page.id === id);
  return found < 0 ? fallback : found;
};

const goTo = (pages: readonly GuidePage[], index: number): DialogueCursor | DialogueEnd =>
  index >= pages.length ? { end: true } : { index, replies: [], after: index + 1 };

const afterReply = (pages: readonly GuidePage[], cursor: DialogueCursor) =>
  cursor.effect ? { end: true as const, effect: cursor.effect } : goTo(pages, cursor.after);

/** Returns the cursor after Next: the rest of a reply, then the page it leads to, or the end. */
export const nextPage = (
  pages: readonly GuidePage[],
  cursor: DialogueCursor,
): DialogueCursor | DialogueEnd => {
  if (cursor.replies.length > 1) return { ...cursor, replies: cursor.replies.slice(1) };
  if (cursor.replies.length === 1) return afterReply(pages, cursor);
  return goTo(pages, cursor.index + 1);
};

/**
 * Returns the cursor after picking an option: its reply first, then the page it leads to, or the
 * end of the dialogue with its effect.
 */
export const chooseOption = (
  pages: readonly GuidePage[],
  cursor: DialogueCursor,
  option: ChoiceOption,
): DialogueCursor | DialogueEnd => {
  const next: DialogueCursor = {
    index: cursor.index,
    replies: option.reply,
    after: indexOf(pages, option.goto, cursor.index + 1),
    effect: option.effect,
  };
  return option.reply.length === 0 ? afterReply(pages, next) : next;
};
