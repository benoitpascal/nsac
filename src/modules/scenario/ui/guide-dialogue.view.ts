import { chooseOption, currentPage, nextPage, startDialogue } from '../core/dialogue';
import { fillControlRow } from './control-row.view';
import { button, cutButton, el } from './dom';
import type { DialogueCursor, DialogueEnd } from '../core/dialogue';
import type { DialogueEffect, GuidePage, QuestionPage } from '../core/scenario-content';
import type { Voice } from '../core/voice';

const KEYS = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];

const REPEAT_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M19.5 3.5v5h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/** Figma « Btn repeat »: a small icon and word at the card's bottom right (sound on/off sits by the mascot). */
const repeatButton = (voice: Voice, lastLine: () => string) => {
  const repeat = button('', 'guide__repeat', () => voice.repeat(lastLine()));
  repeat.innerHTML = REPEAT_ICON;
  repeat.append('Repeat');
  repeat.title = 'Hear it again';
  return repeat;
};

/**
 * Plays a dialogue of the mascot inside the bubble, with Back and Next in the actions row under
 * it (never inside the card, as in Figma): texts with Next and Back, choices and
 * questions as 1 to 4 buttons (also keys 1 to 4). A wrong answer is explained and greyed out.
 * The voice, when given, reads each page and each answer's explanation aloud; onAnswer
 * plays the sound of a right or a wrong answer.
 * Under it, the control row: Back (on the first page, back to the terminal menu, when given) and
 * Next, greyed out until the page's question is answered, then Exit dashboard (when given).
 * Calls onEnd after the last page, with the effect of the last option picked, if any. Returns how
 * to stop listening to the keyboard and talking.
 */
export const playDialogue = (
  bubble: HTMLElement,
  actions: HTMLElement,
  pages: readonly GuidePage[],
  onEnd: (effect?: DialogueEffect) => void,
  voice?: Voice,
  back?: () => void,
  leave?: () => void,
  onAnswer?: (correct: boolean) => void,
) => {
  const trail: DialogueCursor[] = [];
  let spoken = '';
  let keyActions: (() => void)[] = [];
  const go = (next: DialogueCursor | DialogueEnd, from?: DialogueCursor) => {
    if ('end' in next) return onEnd(next.effect);
    if (from) trail.push(from);
    render(next);
  };
  const footer = (cursor: DialogueCursor, withNext: boolean) => {
    const next = cutButton(
      'Next',
      'text',
      () => go(nextPage(pages, cursor), cursor),
      'guide__next cut-button--forward',
    );
    next.disabled = !withNext;
    fillControlRow(actions, {
      back: trail.length > 0 ? () => render(trail.pop() ?? startDialogue()) : back,
      leave,
      actions: [next],
    });
    if (withNext) keyActions = [() => next.click()];
  };
  const renderQuestion = (page: QuestionPage, cursor: DialogueCursor, list: HTMLElement) => {
    const feedback = el('p', 'guide__feedback');
    feedback.setAttribute('aria-live', 'polite');
    const buttons = page.answers.map((answer) =>
      button(answer.label, 'guide__option', () => {
        feedback.textContent = `${answer.correct ? '✓ ' : '✗ '}${answer.explanation}`;
        spoken = answer.explanation;
        voice?.say(answer.explanation);
        feedback.classList.toggle('guide__feedback--right', answer.correct);
        onAnswer?.(answer.correct);
        if (!answer.correct)
          return buttons[page.answers.indexOf(answer)].setAttribute('aria-disabled', 'true');
        buttons.forEach((option) => (option.disabled = true));
        footer(cursor, true);
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
    spoken = page.text;
    voice?.say(page.text);
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
      footer(cursor, true);
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
      footer(cursor, false);
    }
    if (voice) bubble.append(repeatButton(voice, () => spoken));
    (
      bubble.querySelector<HTMLElement>('.guide__option') ??
      actions.querySelector<HTMLElement>('.cut-button--wide')
    )?.focus();
  };
  const onKey = (event: KeyboardEvent) => {
    const index = KEYS.indexOf(event.code);
    if (index >= 0 && keyActions.length > 1) keyActions[index]?.();
  };
  window.addEventListener('keydown', onKey);
  render(startDialogue());
  return () => {
    window.removeEventListener('keydown', onKey);
    voice?.stop();
  };
};
