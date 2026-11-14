import type { Question } from './question';

/** Questions about famous space missions, astronauts and telescopes. */
// prettier-ignore
export const MISSION_QUESTIONS: readonly Question[] = [
  { prompt: 'What was the first satellite in space, in 1957?', answers: ['Sputnik 1', 'Apollo 11', 'Hubble', 'Voyager 1'], fact: 'Sputnik 1 was a metal ball that sent “beep beep” by radio.' },
  { prompt: 'Who was the first person in space, in 1961?', answers: ['Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'], fact: 'Gagarin went once around Earth in about 108 minutes.' },
  { prompt: 'Who was the first woman in space, in 1963?', answers: ['Valentina Tereshkova', 'Sally Ride', 'Mae Jemison'], fact: 'She went 48 times around Earth in about 3 days.' },
  { prompt: 'Which mission first landed people on the Moon, in 1969?', answers: ['Apollo 11', 'Sputnik 1', 'Voyager 2', 'Hubble'], fact: 'Michael Collins stayed in orbit while his two friends walked on the Moon.' },
  { prompt: 'Who was the first person to walk on the Moon?', answers: ['Neil Armstrong', 'Yuri Gagarin', 'Buzz Aldrin', 'Michael Collins'], fact: 'There is no wind on the Moon, so his footprints are still there.' },
  { prompt: 'What is the ISS?', answers: ['A space station', 'A rocket', 'A planet', 'A telescope'], fact: 'The ISS goes around Earth about 16 times a day.' },
  { prompt: 'Which space probe is the farthest from Earth?', answers: ['Voyager 1', 'Hubble', 'Sputnik 1', 'Curiosity'], fact: 'Voyager 1 was launched in 1977 and is still sending messages.' },
  { prompt: 'Which probe flew past Jupiter, Saturn, Uranus and Neptune?', answers: ['Voyager 2', 'Sputnik 1', 'Hubble', 'Curiosity'], fact: 'Voyager 2 is still the only probe to visit Uranus and Neptune.' },
  { prompt: 'What is Curiosity?', answers: ['A rover on Mars', 'A telescope', 'A space station', 'A moon'], fact: 'Curiosity is as big as a car and landed on Mars in 2012.' },
  { prompt: 'What is Hubble?', answers: ['A space telescope', 'A rover on Mars', 'A rocket', 'A star'], fact: 'Hubble was launched in 1990 and looks at space from above the air.' },
  { prompt: 'Which space telescope was launched in 2021?', answers: ['James Webb', 'Hubble', 'Voyager 2', 'Sputnik 1'], fact: 'James Webb has a golden mirror 6.5 metres wide.' },
  { prompt: 'Who built Sputnik 1 and sent Gagarin to space?', answers: ['The Soviet Union', 'The United States', 'France', 'Japan'], fact: 'The race to space pushed both countries to go to space very fast.' },
];
