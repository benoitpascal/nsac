import '../quiz.css';
import { QUESTION_BANK } from '../core/bank';
import { examResult, isExamOver, nextQuestion, pickAnswer, startExam } from '../core/exam';
import { element } from './element';
import { renderQuestion } from './question.view';
import type { Random } from '../core/shuffle';
import type { MiniGameResult, StopGame } from '../../../core/minigame';

/** Time (ms) before moving on by itself to the next question once one is answered. */
const AUTO_NEXT_MS = 7000;
const FIRST_KEY = 1;

/**
 * Runs the astronaut exam inside the container: one question at a time, answered by tapping or
 * with keys 1 to 4, Enter going to the next one; calls finish once with the result at the end.
 */
export const startQuiz = (
  container: HTMLElement,
  finish: (result: MiniGameResult) => void,
  random: Random,
): StopGame => {
  let exam = startExam(QUESTION_BANK, random);
  let timer: number | undefined;
  const root = element('div', 'mg-quiz');
  container.replaceChildren(root);

  const clearTimer = () => {
    window.clearTimeout(timer);
    timer = undefined;
  };
  const goNext = () => {
    if (exam.picked === undefined) return;
    clearTimer();
    exam = nextQuestion(exam);
    if (isExamOver(exam)) {
      root.replaceChildren(element('p', 'mg-quiz-done', 'Exam finished!'));
      finish(examResult(exam));
      return;
    }
    render();
  };
  const pick = (choice: number) => {
    if (exam.picked !== undefined) return;
    exam = pickAnswer(exam, choice);
    if (exam.picked === undefined) return;
    render();
    timer = window.setTimeout(goNext, AUTO_NEXT_MS);
  };
  const render = () => renderQuestion(root, exam, { onPick: pick, onNext: goNext });
  const onKey = (event: KeyboardEvent) => {
    if (isExamOver(exam)) return;
    const choice = Number(event.key) - FIRST_KEY;
    if (Number.isInteger(choice) && event.key.trim() !== '') pick(choice);
    else if (event.key === 'Enter' && exam.picked !== undefined) {
      event.preventDefault();
      goNext();
    }
  };

  window.addEventListener('keydown', onKey);
  render();
  return () => {
    clearTimer();
    window.removeEventListener('keydown', onKey);
  };
};
