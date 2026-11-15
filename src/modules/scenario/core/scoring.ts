import { BAG } from './loadout';
import { KNOWLEDGE_BY_QUALITY, qualityOf } from './quality';
import type { MissionResult, Verdict } from './campaign';

/** Regolith the excavator mission asks for (kg). */
export const EXCAVATOR_GOAL_KG = 50;
/** Robot power points under which a finished excavator mission counts as thrifty. */
const THRIFTY_POWER_POINTS = 3;
const WATER_POINT_PER_KG = 0.1;
/** Printer calibration: laser power points always spent, and per missing score point. */
const PRINTER_BASE_POINTS = 2;
const PRINTER_POINTS_PER_SCORE = 0.1;
const PRINTER_GOOD_SCORE = 70;
const MAX_SCORE = 100;
/** Knowledge the robot mission brings when finished (half when not). */
const ROBOT_KNOWLEDGE = 10;
/** Bricks wasted by a rough or unfinished shelter build. */
const SHELTER_WASTE_BRICKS = 2;

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
    used: { power, water },
    details: { ...run },
    regolithKg: run.deliveredKg,
    knowledge: objectiveShare < 1 ? ROBOT_KNOWLEDGE / 2 : ROBOT_KNOWLEDGE,
  };
};

/**
 * Works out the printer calibration (laser mirrors mini-game): every mirror flip costs the laser
 * some power, and the score sets how well the printer will turn regolith into bricks.
 */
export const scorePrinter = (won: boolean, score: number): MissionResult => {
  const power = round(PRINTER_BASE_POINTS + (MAX_SCORE - score) * PRINTER_POINTS_PER_SCORE);
  const verdict: Verdict = !won
    ? 'unfinished'
    : score >= PRINTER_GOOD_SCORE
      ? 'efficient'
      : 'wasteful';
  return {
    missionId: 'printer',
    verdict,
    objectiveShare: won ? 1 : 0,
    used: { power },
    details: { score, won: won ? 1 : 0 },
    printerQuality: qualityOf(won ? score : 0),
  };
};

/**
 * Works out the shelter build (precision balance mini-game): a careful build wastes no bricks, a
 * rough or unfinished one wastes some; the knowledge gained follows the build quality.
 */
export const scoreShelter = (won: boolean, score: number): MissionResult => {
  const quality = qualityOf(won ? score : 0);
  const verdict: Verdict =
    quality === 'optimal' ? 'efficient' : quality === 'partial' ? 'wasteful' : 'unfinished';
  return {
    missionId: 'shelter',
    verdict,
    objectiveShare: quality === 'failed' ? 0 : 1,
    used: {},
    details: { score, won: won ? 1 : 0 },
    bricks: quality === 'optimal' ? 0 : -SHELTER_WASTE_BRICKS,
    knowledge: KNOWLEDGE_BY_QUALITY[quality],
    shelterQuality: quality,
  };
};
