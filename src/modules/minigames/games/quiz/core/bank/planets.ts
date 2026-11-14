import type { Question } from './question';

/** Questions about the planets and their order from the Sun. */
// prettier-ignore
export const PLANET_QUESTIONS: readonly Question[] = [
  { prompt: 'Which planet is the closest to the Sun?', answers: ['Mercury', 'Venus', 'Earth', 'Mars'], fact: 'A year on Mercury lasts only 88 Earth days.' },
  { prompt: 'Which is the biggest planet?', answers: ['Jupiter', 'Saturn', 'Earth', 'Neptune'], fact: 'More than 1,000 Earths could fit inside Jupiter.' },
  { prompt: 'Which planet has big, bright rings?', answers: ['Saturn', 'Mars', 'Venus', 'Mercury'], fact: 'Saturn’s rings are made mostly of pieces of ice.' },
  { prompt: 'Which planet is called the Red Planet?', answers: ['Mars', 'Jupiter', 'Venus', 'Uranus'], fact: 'Mars is red because its dust is full of rust.' },
  { prompt: 'Which is the hottest planet?', answers: ['Venus', 'Mercury', 'Mars', 'Jupiter'], fact: 'Thick clouds trap the heat on Venus: it is hot enough to melt lead.' },
  { prompt: 'How many planets go around the Sun?', answers: ['8', '7', '9', '10'], fact: 'Since 2006, Pluto is called a dwarf planet.' },
  { prompt: 'Which planet is the farthest from the Sun?', answers: ['Neptune', 'Uranus', 'Saturn', 'Mars'], fact: 'Neptune takes about 165 Earth years to go once around the Sun.' },
  { prompt: 'Which planet spins lying on its side?', answers: ['Uranus', 'Earth', 'Mars', 'Venus'], fact: 'Because it is tilted, each season on Uranus lasts about 21 years.' },
  { prompt: 'Which planet is the third from the Sun?', answers: ['Earth', 'Mars', 'Venus', 'Jupiter'], fact: 'Earth is the only planet where we know there is life.' },
];
