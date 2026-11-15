/** Quarter turn (radians): the camera looks at the robot from its side. */
const SIDE_TURN = Math.PI / 2;
/** How fast the camera swings round (radians per second). */
const SWING_SPEED = 2.5;
/** How long (s) the camera stays at the side after the drums stop, between two presses of Space. */
const LINGER_SECONDS = 1.2;

/**
 * Swings the follow camera to the robot's side while its drums dig or unload, so both drums show
 * side by side, then back behind it once it drives again. Returns the angle to add to the heading
 * the camera follows.
 */
export const createSideView = () => {
  let turn = 0;
  let sinceWork = Infinity;
  return (working: boolean, seconds: number) => {
    sinceWork = working ? 0 : sinceWork + seconds;
    const wanted = sinceWork < LINGER_SECONDS ? SIDE_TURN : 0;
    const step = SWING_SPEED * seconds;
    turn += Math.min(Math.max(wanted - turn, -step), step);
    return turn;
  };
};
