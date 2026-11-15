import { chooseOption, currentPage, nextPage, startDialogue } from '../core/dialogue';
import { button, el } from './dom';
import type { DialogueCursor } from '../core/dialogue';
import type { GuidePage, QuestionPage } from '../core/scenario-content';

const KEYS = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];

/**
 * Plays a dialogue of the mascot inside the bubble: texts with Next and Back, choices and
 * questions as 1 to 4 buttons (also keys 1 to 4). A wrong answer is explained and greyed out.
 * Calls onEnd after the last page. Returns how to stop listening to the keyboard.
 */
export const playDialogue = (
  bubble: HTMLElement,
  pages: readonly GuidePage[],
  onEnd: () => void,
) => {
  const trail: DialogueCursor[] = [];
  let keyActions: (() => void)[] = [];
  const go = (next: DialogueCursor | 'end', from?: DialogueCursor) => {
    if (next === 'end') return onEnd();
    if (from) trail.push(from);
    render(next);
  };
  const footer = (cursor: DialogueCursor, withNext: boolean) => {
    const row = el('div', 'guide__actions');
    if (trail.length > 0)
      row.append(button('Back', 'guide__back', () => render(trail.pop() ?? startDialogue())));
    if (withNext) {
      const next = button('Next', 'pill-button guide__next', () =>
        go(nextPage(pages, cursor), cursor),
      );
      row.append(next);
      keyActions = [() => next.click()];
    }
    return row;
  };
  const renderQuestion = (page: QuestionPage, cursor: DialogueCursor, list: HTMLElement) => {
    const feedback = el('p', 'guide__feedback');
    feedback.setAttribute('aria-live', 'polite');
    const buttons = page.answers.map((answer) =>
      button(answer.label, 'guide__option', () => {
        feedback.textContent = `${answer.correct ? '✓ ' : '✗ '}${answer.explanation}`;
        feedback.classList.toggle('guide__feedback--right', answer.correct);
        if (!answer.correct)
          return buttons[page.answers.indexOf(answer)].setAttribute('aria-disabled', 'true');
        buttons.forEach((option) => (option.disabled = true));
        bubble.append(footer(cursor, true));
      }),
    );
    list.append(...buttons);
    keyActions = buttons.map((option) => () => option.click());
    return feedback;
  };
  const render = (cursor: DialogueCursor) => {
    const page = currentPage(pages, cursor);
    keyActions = [];
    bubble.replaceChildren(el('p', 'guide__text', page.text));
    if (page.kind === 'text') {
      if (page.source) {
        const link = el('a', 'guide__source', `Real data · ${page.source.label}`);
        Object.assign(link, {
          href: page.source.url,
          target: '_blank',
          rel: 'noopener noreferrer',
        });
        bubble.append(link);
      }
      bubble.append(footer(cursor, true));
    } else {
      const list = el('div', 'guide__options');
      list.setAttribute('role', 'group');
      bubble.append(list);
      if (page.kind === 'choice') {
        const buttons = page.options.map((option) =>
          button(option.label, 'guide__option', () =>
            go(chooseOption(pages, cursor, option), cursor),
          ),
        );
        list.append(...buttons);
        keyActions = buttons.map((option) => () => option.click());
      } else bubble.append(renderQuestion(page, cursor, list));
      bubble.append(footer(cursor, false));
    }
    bubble.querySelector<HTMLElement>('button')?.focus();
  };
  const onKey = (event: KeyboardEvent) => {
    const index = KEYS.indexOf(event.code);
    if (index >= 0 && keyActions.length > 1) keyActions[index]?.();
  };
  window.addEventListener('keydown', onKey);
  render(startDialogue());
  return () => window.removeEventListener('keydown', onKey);
};
