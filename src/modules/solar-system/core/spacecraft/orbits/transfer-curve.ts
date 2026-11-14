/** A point or direction, in any frame. */
export type Vector = { x: number; y: number; z: number };

const add = (a: Vector, b: Vector, scale = 1): Vector => ({
  x: a.x + b.x * scale,
  y: a.y + b.y * scale,
  z: a.z + b.z * scale,
});

const CONTROL_FRACTION = 1 / 3;

/**
 * Returns the point at the given progress (0 to 1) of a smooth curve leaving the start along
 * its direction and reaching the end along its direction (cubic Bézier, unit directions).
 */
export const transferPoint = (
  start: Vector,
  startDirection: Vector,
  end: Vector,
  endDirection: Vector,
  progress: number,
): Vector => {
  const reach = Math.hypot(end.x - start.x, end.y - start.y, end.z - start.z) * CONTROL_FRACTION;
  const controls = [start, add(start, startDirection, reach), add(end, endDirection, -reach), end];
  const u = Math.min(Math.max(progress, 0), 1);
  const weights = [(1 - u) ** 3, 3 * (1 - u) ** 2 * u, 3 * (1 - u) * u ** 2, u ** 3];
  return controls.reduce((sum, point, index) => add(sum, point, weights[index]), {
    x: 0,
    y: 0,
    z: 0,
  });
};

/** Returns the unit vector pointing the same way, or the vector itself when it has no length. */
export const unit = (vector: Vector): Vector => {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  return length === 0
    ? vector
    : { x: vector.x / length, y: vector.y / length, z: vector.z / length };
};
