import type { ItemColour, ItemKind } from './items';

/** One answer the player can pick, or what a question is about. */
export type Option =
  | { type: 'kind'; kind: ItemKind }
  | { type: 'colour'; colour: ItemColour }
  | { type: 'number'; value: number };

/** The question kinds: count something, find the missing item, or recall a colour. */
export const QUESTION_ASKS = ['howMany', 'notThere', 'whatColour'] as const;
/** A question kind. */
export type QuestionAsk = (typeof QUESTION_ASKS)[number];

/**
 * A question about the hidden picture, with its options and the index of the right one.
 * `about` is the kind or colour to count, or the kind whose colour is asked.
 */
export type Question =
  | { ask: 'howMany' | 'whatColour'; about: Option; options: Option[]; answer: number }
  | { ask: 'notThere'; options: Option[]; answer: number };

/** Most options a question offers. */
export const MAX_OPTIONS = 4;
