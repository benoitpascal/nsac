import { startQuiz } from './ui/quiz.view';
import type { MiniGame } from '../../core/minigame';

/** Quiz: an astronaut exam of ten space questions, passed with six right answers. */
export const quizGame: MiniGame = {
  id: 'quiz',
  title: 'Quiz',
  summary: 'Pass the astronaut exam: answer space questions and get at least 6 right out of 10.',
  start: (container, finish) => startQuiz(container, finish, Math.random),
};
