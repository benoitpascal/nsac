import { MAX_SCORE } from '../../../core/minigame';
import { shuffle } from './shuffle';
import type { Question } from './bank';
import type { Random } from './shuffle';
import type { MiniGameResult } from '../../../core/minigame';

/** A question as asked: answers in a random order, with the index of the right one. */
export type ExamQuestion = {
  prompt: string;
  answers: readonly string[];
  correct: number;
  fact: string;
};

/** The exam: its questions, which one is asked, the answer picked for it, and the right ones. */
export type Exam = {
  questions: readonly ExamQuestion[];
  current: number;
  picked: number | undefined;
  rightCount: number;
};

/** How many questions an exam asks. */
export const QUESTIONS_PER_EXAM = 10;
/** Right answers needed to pass the exam. */
export const PASS_MARK = 6;

const toExamQuestion = (question: Question, random: Random): ExamQuestion => {
  const order = shuffle(
    question.answers.map((_, index) => index),
    random,
  );
  return {
    prompt: question.prompt,
    answers: order.map((index) => question.answers[index]),
    correct: order.indexOf(0),
    fact: question.fact,
  };
};

/** Starts an exam of different questions picked at random from the bank, answers shuffled. */
export const startExam = (bank: readonly Question[], random: Random): Exam => ({
  questions: shuffle(bank, random)
    .slice(0, QUESTIONS_PER_EXAM)
    .map((question) => toExamQuestion(question, random)),
  current: 0,
  picked: undefined,
  rightCount: 0,
});

/** The question being asked, or undefined once the exam is over. */
export const currentQuestion = (exam: Exam): ExamQuestion | undefined =>
  exam.questions[exam.current];

/** Picks an answer for the current question; ignored if already answered or out of range. */
export const pickAnswer = (exam: Exam, choice: number): Exam => {
  const question = currentQuestion(exam);
  if (!question || exam.picked !== undefined || choice < 0 || choice >= question.answers.length)
    return exam;
  const right = choice === question.correct ? 1 : 0;
  return { ...exam, picked: choice, rightCount: exam.rightCount + right };
};

/** Moves to the next question once the current one is answered. */
export const nextQuestion = (exam: Exam): Exam =>
  exam.picked === undefined ? exam : { ...exam, current: exam.current + 1, picked: undefined };

/** True once every question has been answered. */
export const isExamOver = (exam: Exam) => exam.current >= exam.questions.length;

/** Score is the share of right answers; passing needs PASS_MARK right answers. */
export const examResult = (exam: Exam): MiniGameResult => ({
  won: exam.rightCount >= PASS_MARK,
  score: Math.round((exam.rightCount / exam.questions.length) * MAX_SCORE),
});
