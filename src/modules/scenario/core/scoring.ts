import { BAG } from './loadout';
import type { MissionResult, Verdict } from './campaign';

/** Regolith the excavator mission asks for (kg). */
export const EXCAVATOR_GOAL_KG = 50;
/** Robot power points under which a finished excavator mission counts as thrifty. */
const THRIFTY_POWER_POINTS = 3;
const WATER_POINT_PER_KG = 0.1;
/** Laser mission: power points always spent, and per missing score point. */
const LASER_BASE_POINTS = 2;
const LASER_POINTS_PER_SCORE = 0.1;
const LASER_GOOD_SCORE = 70;
const MAX_SCORE = 100;

const round = (value: number) => Math.round(value * 10) / 10;

/** What the excavator mission measured. */
export type ExcavatorRun = { deliveredKg: number; robotKwhUsed: number };

/**
 * Works out the excavator mission, driven from inside the base: regolith brought back and the
 * robot power it took; no suit air is used.
 */
export const scoreExcavator = (run: ExcavatorRun): MissionResult => {
  const objectiveShare = Math.min(run.deliveredKg / EXCAVATOR_GOAL_KG, 1);
  const power = round((BAG.powerPerCharge * run.robotKwhUsed) / BAG.chargeKwh);
  const water = -round(run.deliveredKg * WATER_POINT_PER_KG);
  const verdict: Verdict =
    objectiveShare < 1 ? 'unfinished' : power <= THRIFTY_POWER_POINTS ? 'efficient' : 'wasteful';
  return {
    missionId: 'excavator',
    verdict,
    objectiveShare,
    used: { air: 0, power, water },
    details: { ...run },
  };
};

/** Works out the laser mission: every mirror flip costs the laser some power. */
export const scoreLaser = (won: boolean, score: number): MissionResult => {
  const power = round(LASER_BASE_POINTS + (MAX_SCORE - score) * LASER_POINTS_PER_SCORE);
  const verdict: Verdict = !won
    ? 'unfinished'
    : score >= LASER_GOOD_SCORE
      ? 'efficient'
      : 'wasteful';
  return {
    missionId: 'laser-comms',
    verdict,
    objectiveShare: won ? 1 : 0,
    used: { air: 0, power, water: 0 },
    details: { score, won: won ? 1 : 0 },
  };
};
