import { describe, expect, it } from 'vitest';
import {
  chooseOption,
  currentPage,
  nextPage,
  startDialogue,
} from '@/modules/scenario/core/dialogue';
import type { DialogueCursor } from '@/modules/scenario/core/dialogue';
import type { ChoicePage, GuidePage } from '@/modules/scenario/core/scenario-content';

const choice: ChoicePage = {
  kind: 'choice',
  text: 'What do you want to know?',
  options: [
    {
      label: 'Who are you?',
      reply: [
        { kind: 'text', text: 'I am your assistant.' },
        { kind: 'text', text: 'Nice!' },
      ],
    },
    { label: 'Skip', reply: [], goto: 'end' },
  ],
};
const pages: GuidePage[] = [
  { kind: 'text', text: 'Hello' },
  choice,
  { kind: 'text', text: 'Base tour' },
  { kind: 'text', id: 'end', text: 'Let us work' },
];

const textOf = (cursor: DialogueCursor | 'end') =>
  cursor === 'end' ? 'end' : (currentPage(pages, cursor) as { text: string }).text;

describe('a dialogue with a choice', () => {
  it('reads the reply page by page, then goes on to the next page', () => {
    const atChoice = nextPage(pages, startDialogue()) as DialogueCursor;
    const reply = chooseOption(pages, atChoice, choice.options[0]) as DialogueCursor;
    expect(textOf(reply)).toBe('I am your assistant.');
    const rest = nextPage(pages, reply) as DialogueCursor;
    expect(textOf(rest)).toBe('Nice!');
    expect(textOf(nextPage(pages, rest))).toBe('Base tour');
  });

  it('jumps to the page an option leads to', () => {
    const atChoice = nextPage(pages, startDialogue()) as DialogueCursor;
    expect(textOf(chooseOption(pages, atChoice, choice.options[1]))).toBe('Let us work');
  });

  it('ends after the last page', () => {
    expect(nextPage(pages, { index: 3, replies: [], after: 4 })).toBe('end');
  });
});
