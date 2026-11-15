/** A tube of fuel layers, listed from bottom to top; each layer is a color index. */
export type Tube = readonly number[];

/** Every tube of the rack, in display order. */
export type Rack = readonly Tube[];

/** How many layers a tube holds when full. */
export const TUBE_CAPACITY = 4;

const topOf = (tube: Tube) => tube[tube.length - 1];

/** Counts the layers of the same color stacked at the top of the tube (0 when empty). */
export const topRun = (tube: Tube) => {
  let count = 0;
  while (count < tube.length && tube[tube.length - 1 - count] === topOf(tube)) count += 1;
  return count;
};

/** Free room left in the tube, in layers. */
export const roomIn = (tube: Tube) => TUBE_CAPACITY - tube.length;

/**
 * Counts the layers a pour from one tube to another would move: the top run, as far as there is
 * room, and only onto an empty tube or onto the same color. Returns 0 when the pour is not allowed.
 */
export const pourAmount = (rack: Rack, from: number, to: number) => {
  const source = rack[from];
  const target = rack[to];
  if (from === to || source === undefined || target === undefined || source.length === 0) return 0;
  if (target.length > 0 && topOf(target) !== topOf(source)) return 0;
  return Math.min(topRun(source), roomIn(target));
};

/** Moves the given number of top layers from one tube onto another. */
export const moveLayers = (rack: Rack, from: number, to: number, count: number): Rack => {
  const moved = rack[from]?.slice(-count) ?? [];
  return rack.map((tube, index) => {
    if (index === from) return tube.slice(0, -count);
    if (index === to) return [...tube, ...moved];
    return tube;
  });
};

/** Pours from one tube into another, or returns the rack unchanged when the pour is not allowed. */
export const pour = (rack: Rack, from: number, to: number): Rack => {
  const amount = pourAmount(rack, from, to);
  return amount === 0 ? rack : moveLayers(rack, from, to, amount);
};

/** Tells whether every non-empty tube is full of a single color. */
export const isSorted = (rack: Rack) =>
  rack.every((tube) => tube.length === 0 || topRun(tube) === TUBE_CAPACITY);

/** Counts the places where two touching layers differ: 0 for a sorted rack. */
export const disorderOf = (rack: Rack) =>
  rack.reduce((sum, tube) => sum + tube.slice(1).filter((layer, i) => layer !== tube[i]).length, 0);
