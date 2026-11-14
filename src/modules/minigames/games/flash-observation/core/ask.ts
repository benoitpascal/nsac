import { ITEM_COLOURS, countItems } from './items';
import { MAX_OPTIONS } from './question';
import { pickOne, sample, shuffle } from './random';
import type { Picture } from './picture';
import type { Option, Question, QuestionAsk } from './question';
import type { Random } from './random';

const NEAR_COUNTS = [-1, 1, -2, 2, 3];

const askHowMany = (random: Random, picture: Picture): Question => {
  const kinds = [...new Set(picture.items.map((item) => item.kind))];
  const colours = picture.colours.filter((colour) =>
    picture.items.some((item) => item.colour === colour),
  );
  const about: Option =
    random() < 1 / 2
      ? { type: 'kind', kind: pickOne(random, kinds) }
      : { type: 'colour', colour: pickOne(random, colours) };
  const count = countItems(picture.items, (item) =>
    about.type === 'kind' ? item.kind === about.kind : item.colour === about.colour,
  );
  const wrong = NEAR_COUNTS.map((step) => count + step).filter((value) => value >= 0);
  const values = [count, ...wrong.slice(0, MAX_OPTIONS - 1)].sort((a, b) => a - b);
  const options = values.map((value): Option => ({ type: 'number', value }));
  return { ask: 'howMany', about, options, answer: values.indexOf(count) };
};

const askNotThere = (random: Random, picture: Picture): Question => {
  const present = [...new Set(picture.items.map((item) => item.kind))];
  const missing = pickOne(random, picture.missing);
  const kinds = shuffle(random, [missing, ...sample(random, present, MAX_OPTIONS - 1)]);
  const options = kinds.map((kind): Option => ({ type: 'kind', kind }));
  return { ask: 'notThere', options, answer: kinds.indexOf(missing) };
};

const askWhatColour = (picture: Picture): Question => {
  const colours = ITEM_COLOURS.filter((colour) => picture.colours.includes(colour));
  const options = colours.map((colour): Option => ({ type: 'colour', colour }));
  const about: Option = { type: 'kind', kind: picture.single.kind };
  return { ask: 'whatColour', about, options, answer: colours.indexOf(picture.single.colour) };
};

/** Asks a question of the given kind about the picture, with exactly one right option. */
export const askQuestion = (random: Random, picture: Picture, ask: QuestionAsk): Question => {
  if (ask === 'howMany') return askHowMany(random, picture);
  if (ask === 'notThere') return askNotThere(random, picture);
  return askWhatColour(picture);
};
