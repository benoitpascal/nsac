import { currentQuestion } from '../core/exam';
import { element } from './element';
import type { Exam, ExamQuestion } from '../core/exam';

/** What the player can do on a question: pick an answer, then go to the next question. */
export type QuestionActions = { onPick: (choice: number) => void; onNext: () => void };

const PERCENT = 100;

const progress = (exam: Exam) => {
  const box = element('div', 'mg-quiz-progress');
  const label = element(
    'p',
    'mg-quiz-count',
    `Question ${exam.current + 1} of ${exam.questions.length}`,
  );
  const bar = element('div', 'mg-quiz-bar');
  const fill = element('div', 'mg-quiz-fill');
  fill.style.width = `${(exam.current / exam.questions.length) * PERCENT}%`;
  bar.append(fill);
  box.append(label, bar);
  return box;
};

const answerClass = (question: ExamQuestion, picked: number | undefined, index: number) => {
  if (picked === undefined) return 'mg-quiz-answer';
  if (index === question.correct) return 'mg-quiz-answer mg-quiz-answer--right';
  return index === picked ? 'mg-quiz-answer mg-quiz-answer--wrong' : 'mg-quiz-answer';
};

const answers = (question: ExamQuestion, picked: number | undefined, actions: QuestionActions) => {
  const list = element('div', 'mg-quiz-answers');
  question.answers.forEach((text, index) => {
    const button = element('button', answerClass(question, picked, index));
    button.type = 'button';
    button.disabled = picked !== undefined;
    button.append(element('span', 'mg-quiz-key', String(index + 1)), element('span', '', text));
    button.addEventListener('click', () => actions.onPick(index));
    list.append(button);
  });
  return list;
};

const feedback = (question: ExamQuestion, picked: number, actions: QuestionActions) => {
  const right = picked === question.correct;
  const box = element(
    'div',
    right ? 'mg-quiz-feedback mg-quiz-feedback--right' : 'mg-quiz-feedback',
  );
  const verdict = right ? 'Right!' : `Not quite! It was: ${question.answers[question.correct]}`;
  const next = element('button', 'mg-quiz-next', 'Next ➜');
  next.type = 'button';
  next.addEventListener('click', actions.onNext);
  box.append(
    element('p', 'mg-quiz-verdict', verdict),
    element('p', 'mg-quiz-fact', question.fact),
    next,
  );
  return box;
};

/** Draws the current question of the exam, with the result and a fun fact once answered. */
export const renderQuestion = (root: HTMLElement, exam: Exam, actions: QuestionActions) => {
  const question = currentQuestion(exam);
  if (!question) return;
  const parts = [progress(exam), element('h2', 'mg-quiz-prompt', question.prompt)];
  parts.push(answers(question, exam.picked, actions));
  if (exam.picked !== undefined) parts.push(feedback(question, exam.picked, actions));
  root.replaceChildren(...parts);
  root.querySelector<HTMLButtonElement>('.mg-quiz-next')?.focus();
};
