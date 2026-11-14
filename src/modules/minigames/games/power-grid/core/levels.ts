import type { Level } from './puzzle';

/**
 * The three levels, from 5×5 to 7×7. Each is stored as its solution: every cable starts on a
 * socket and its moves lead to the partner socket, and all cables together fill the grid once.
 */
export const LEVELS: readonly Level[] = [
  {
    size: 5,
    solution: [
      { start: { row: 0, col: 3 }, moves: 'LLLDDD' },
      { start: { row: 0, col: 4 }, moves: 'DDDD' },
      { start: { row: 2, col: 1 }, moves: 'URRDD' },
      { start: { row: 2, col: 2 }, moves: 'DL' },
      { start: { row: 4, col: 0 }, moves: 'RRR' },
    ],
  },
  {
    size: 6,
    solution: [
      { start: { row: 0, col: 0 }, moves: 'RRRRRDDDDD' },
      { start: { row: 1, col: 4 }, moves: 'LLLLDDD' },
      { start: { row: 3, col: 3 }, moves: 'ULLDD' },
      { start: { row: 2, col: 4 }, moves: 'DDD' },
      { start: { row: 3, col: 2 }, moves: 'DR' },
      { start: { row: 5, col: 0 }, moves: 'RRR' },
    ],
  },
  {
    size: 7,
    solution: [
      { start: { row: 0, col: 0 }, moves: 'RRDDRRDD' },
      { start: { row: 0, col: 3 }, moves: 'RRRDDD' },
      { start: { row: 1, col: 3 }, moves: 'RRDDD' },
      { start: { row: 1, col: 0 }, moves: 'DDDDD' },
      { start: { row: 1, col: 1 }, moves: 'DDDR' },
      { start: { row: 3, col: 2 }, moves: 'RDDLL' },
      { start: { row: 4, col: 6 }, moves: 'DLL' },
      { start: { row: 6, col: 1 }, moves: 'RRRRR' },
    ],
  },
];
