import type { ChoiceOption, GuidePage } from './scenario-content';

/**
 * Where the player stands in a dialogue: the page of the script, and the mascot's reply pages to
 * a choice still to show before going on to the page `after`.
 */
export type DialogueCursor = { index: number; replies: GuidePage[]; after: number };

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

const goTo = (pages: readonly GuidePage[], index: number): DialogueCursor | 'end' =>
  index >= pages.length ? 'end' : { index, replies: [], after: index + 1 };

/** Returns the cursor after Next: the rest of a reply, then the page it leads to, or the end. */
export const nextPage = (
  pages: readonly GuidePage[],
  cursor: DialogueCursor,
): DialogueCursor | 'end' => {
  if (cursor.replies.length > 1) return { ...cursor, replies: cursor.replies.slice(1) };
  if (cursor.replies.length === 1) return goTo(pages, cursor.after);
  return goTo(pages, cursor.index + 1);
};

/** Returns the cursor after picking an option: its reply first, then the page it leads to. */
export const chooseOption = (
  pages: readonly GuidePage[],
  cursor: DialogueCursor,
  option: ChoiceOption,
): DialogueCursor | 'end' => {
  const after = indexOf(pages, option.goto, cursor.index + 1);
  if (option.reply.length === 0) return goTo(pages, after);
  return { index: cursor.index, replies: option.reply, after };
};
