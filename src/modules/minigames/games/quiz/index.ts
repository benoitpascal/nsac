import { startQuiz } from './ui/quiz.view';
import type { MiniGame } from '../../core/minigame';

/** Quiz: an astronaut exam of ten space questions, passed with six right answers. */
export const quizGame: MiniGame = {
  id: 'quiz',
  title: 'Quiz',
  summary: 'Pass the astronaut exam: answer space questions and get at least 6 right out of 10.',
  howTo: [
    'Read the question and pick an answer: tap it, or use keys 1 to 4.',
    'Answer 10 questions. You need at least 6 right answers to pass.',
  ],
  start: (container, finish) => startQuiz(container, finish, Math.random),
};
