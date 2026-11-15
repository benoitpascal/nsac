import type { Level } from './board';

/**
 * The three levels, from 6×6 to 8×8. Every mirror on the winning path starts in a lean that
 * misses; `solution` lists, in reading order, leans that light every receiver.
 */
export const LEVELS: readonly Level[] = [
  {
    rows: ['......', 'E../..', '......', '.#....', '.R.\\./', '......'],
    heading: 'right',
    solution: ['\\', '/', '/'],
  },
  {
    rows: ['..E..\\.', '.......', '#./R./.', '.R.....', '....#..', './R..\\.', '.......'],
    heading: 'down',
    solution: ['\\', '\\', '\\', '\\', '/'],
  },
  {
    rows: [
      '.\\......',
      '.....#..',
      '.\\.R.//.',
      '........',
      '...#....',
      './.R#R..',
      '...../.E',
      '.#......',
    ],
    heading: 'left',
    solution: ['\\', '/', '\\', '/', '\\', '\\'],
  },
];
