/** Repeatable pseudo-random numbers in [0, 1). */
export const randomFrom = (seed: number) => {
  let state = seed;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) % 4_294_967_296;
    return state / 4_294_967_296;
  };
};

/** Smooth noise in [0, 1) that wraps around every `cells` cells, so that the tile repeats seamlessly. */
export const wrappingNoise = (cells: number, random: () => number) => {
  const lattice = Array.from({ length: cells * cells }, random);
  const at = (x: number, y: number) => lattice[(y % cells) * cells + (x % cells)];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (u: number, v: number) => {
    const [x, y] = [u * cells, v * cells];
    const [cellX, cellY] = [Math.floor(x), Math.floor(y)];
    const [s, t] = [smooth(x - cellX), smooth(y - cellY)];
    const top = at(cellX, cellY) * (1 - s) + at(cellX + 1, cellY) * s;
    const bottom = at(cellX, cellY + 1) * (1 - s) + at(cellX + 1, cellY + 1) * s;
    return top * (1 - t) + bottom * t;
  };
};
