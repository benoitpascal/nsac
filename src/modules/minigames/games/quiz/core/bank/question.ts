/** A question of the bank: its first answer is the right one, the others are wrong. */
export type Question = {
  prompt: string;
  answers: readonly string[];
  /** One short fun fact shown once the question is answered. */
  fact: string;
};
