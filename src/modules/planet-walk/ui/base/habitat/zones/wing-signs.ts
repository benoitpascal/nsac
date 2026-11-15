import { createZoneSign } from './zone-sign';
import type { WingPlan } from './zone-plan';

/** Name of the round central hall, where the station terminal stands. */
export const HALL_NAME = '13 · Control center';
const OUTSIDE_NAME = 'Outside';
/** Height of a sign's center above the floor, and its distance from the wall it hangs on (m). */
const SIGN = { height: 2.65, offset: 0.17 };

const signAt = (text: string, z: number, turn: number) => {
  const sign = createZoneSign(text);
  sign.position.set(0, SIGN.height, z);
  sign.rotation.y = turn;
  return sign;
};

/**
 * Builds the signs above the doorways of a wing, at the given walls across it (z, from the hall's
 * end to the outer end): walking outwards, each doorway names the room it leads to; walking back,
 * it names the room behind it, down to the control center.
 */
export const wingSigns = (plan: WingPlan, walls: readonly number[]) => {
  const names = [HALL_NAME, ...plan.zones.map((zone) => zone.name)];
  if (plan.outerDoor) names.push(OUTSIDE_NAME);
  return walls.flatMap((z, index) => {
    const ahead = names[index + 1];
    const facesOutside = index === walls.length - 1;
    return [
      ...(index > 0 && ahead ? [signAt(ahead, z - SIGN.offset, Math.PI)] : []),
      ...(!facesOutside || plan.outerDoor ? [signAt(names[index], z + SIGN.offset, 0)] : []),
    ];
  });
};
