import type { Question } from './question';

/** Questions about the Sun, the Moon, gravity, days and years. */
// prettier-ignore
export const SUN_MOON_QUESTIONS: readonly Question[] = [
  { prompt: 'What is the Sun?', answers: ['A star', 'A planet', 'A moon', 'A comet'], fact: 'The Sun is the closest star to Earth.' },
  { prompt: 'How long does sunlight take to reach Earth?', answers: ['About 8 minutes', 'About 1 second', 'About 1 day', 'About 1 year'], fact: 'Light goes 300,000 km every second.' },
  { prompt: 'How long does Earth take to go around the Sun?', answers: ['One year', 'One day', 'One month', 'One week'], fact: 'The trip takes 365 days and about 6 hours: that is why we have leap years.' },
  { prompt: 'What makes day and night?', answers: ['Earth spinning', 'The Sun turning off', 'The Moon hiding the Sun', 'Clouds'], fact: 'Earth spins once in about 24 hours.' },
  { prompt: 'How long does the Moon take to go around Earth?', answers: ['About a month', 'About a day', 'About a year', 'About an hour'], fact: 'The word “month” comes from the word “Moon”.' },
  { prompt: 'Why do we always see the same side of the Moon?', answers: ['It spins once per trip around Earth', 'It never spins', 'Its other side is always dark'], fact: 'The far side of the Moon gets as much sunlight as the near side.' },
  { prompt: 'On the Moon, you would feel…', answers: ['Lighter than on Earth', 'Heavier than on Earth', 'Just the same'], fact: 'Gravity on the Moon is about one sixth of Earth’s: you could jump very high!' },
  { prompt: 'What pulls you down to the ground?', answers: ['Gravity', 'The wind', 'The air', 'The Moon'], fact: 'Gravity also keeps the Moon going around Earth.' },
  { prompt: 'What is the Moon made of?', answers: ['Rock', 'Cheese', 'Ice', 'Gas'], fact: 'Apollo astronauts brought back 382 kg of Moon rocks.' },
  { prompt: 'Why do astronauts float in the space station?', answers: ['They fall around Earth with it', 'There is no gravity in space', 'They wear magic boots'], fact: 'Up there, gravity is still about 90% as strong as on the ground.' },
];
