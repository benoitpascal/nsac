import { chooseOption, currentPage, nextPage, startDialogue } from '../core/dialogue';
import { button, el } from './dom';
import type { DialogueCursor, DialogueEnd } from '../core/dialogue';
import type { DialogueEffect, GuidePage, QuestionPage } from '../core/scenario-content';
import type { Voice } from '../core/voice';

const KEYS = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];

/** The voice buttons at the top of the bubble: sound on / off, and hear the last line again. */
const voiceControls = (voice: Voice, lastLine: () => string) => {
  const label = () => (voice.isMuted() ? '🔇 Sound off' : '🔊 Sound on');
  const toggle = button(label(), 'guide__voice-button', () => {
    voice.setMuted(!voice.isMuted());
    toggle.textContent = label();
    toggle.setAttribute('aria-pressed', String(!voice.isMuted()));
  });
  toggle.setAttribute('aria-pressed', String(!voice.isMuted()));
  const repeat = button('↻ Repeat', 'guide__voice-button', () => voice.repeat(lastLine()));
  const row = el('div', 'guide__voice');
  row.append(toggle, repeat);
  return row;
};

/**
 * Plays a dialogue of the mascot inside the bubble: texts with Next and Back, choices and
 * questions as 1 to 4 buttons (also keys 1 to 4). A wrong answer is explained and greyed out.
 * The voice, when given, reads each page and each answer's explanation aloud.
 * Calls onEnd after the last page, with the effect of the last option picked, if any. Returns how
 * to stop listening to the keyboard and talking.
 */
export const playDialogue = (
  bubble: HTMLElement,
  pages: readonly GuidePage[],
  onEnd: (effect?: DialogueEffect) => void,
  voice?: Voice,
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
    const row = el('div', 'guide__actions');
    if (trail.length > 0)
      row.append(
        button('Back', 'hud-secondary guide__back', () => render(trail.pop() ?? startDialogue())),
      );
    if (withNext) {
      const next = button('Next', 'hud-action guide__next', () =>
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
        spoken = answer.explanation;
        voice?.say(answer.explanation);
        feedback.classList.toggle('guide__feedback--right', answer.correct);
        if (!answer.correct)
          return buttons[page.answers.indexOf(answer)].setAttribute('aria-disabled', 'true');
        buttons.forEach((option) => (option.disabled = true));
        bubble.querySelector('.guide__actions')?.replaceWith(footer(cursor, true));
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
    if (voice) bubble.prepend(voiceControls(voice, () => spoken));
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
  return () => {
    window.removeEventListener('keydown', onKey);
    voice?.stop();
  };
};
