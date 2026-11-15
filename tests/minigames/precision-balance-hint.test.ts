import { describe, expect, it } from 'vitest';
import {
  askHint,
  canAskHint,
  WRONG_TRIES_BEFORE_HINT,
} from '@/modules/minigames/games/precision-balance/core/help';
import { findHint } from '@/modules/minigames/games/precision-balance/core/hint';
import { computeScore, HINT_PENALTY } from '@/modules/minigames/games/precision-balance/core/score';
import {
  nextLevel,
  playMove,
  resetLevel,
  startSession,
} from '@/modules/minigames/games/precision-balance/core/session';
import type { Session } from '@/modules/minigames/games/precision-balance/core/session';
import { isLevelSolved } from '@/modules/minigames/games/precision-balance/core/torque';
import type { Weight } from '@/modules/minigames/games/precision-balance/core/types';

/** Locked 2 kg at left 2 (torque 4); free 2 kg and 1 kg in the tray. */
const LEVEL: readonly Weight[] = [
  { id: 0, mass: 2, locked: true, hook: { side: 'left', distance: 2 } },
  { id: 1, mass: 2, locked: false, hook: null },
  { id: 2, mass: 1, locked: false, hook: null },
];

const sessionOn = (weights: readonly Weight[]): Session => ({
  levels: [weights, weights],
  levelIndex: 0,
  weights,
  moves: 0,
  wrongTries: 0,
  hints: 0,
});

/** Applies hints one after the other until no more is given. */
const followHints = (weights: readonly Weight[]) => {
  let session = sessionOn(weights);
  for (let step = 0; step < 10; step += 1) {
    const hint = findHint(session.weights);
    if (hint === null) break;
    session = playMove(session, hint.weightId, hint.hook);
  }
  return session.weights;
};

describe('precision balance hint', () => {
  it('suggests a free weight still in the tray and a hook', () => {
    const hint = findHint(LEVEL);
    expect(hint).not.toBeNull();
    expect([1, 2]).toContain(hint?.weightId);
    expect(
      LEVEL.some(
        (weight) =>
          weight.locked &&
          weight.hook?.side === hint?.hook.side &&
          weight.hook.distance === hint?.hook.distance,
      ),
    ).toBe(false);
  });

  it('leads to a solved level when the hints are followed', () => {
    expect(isLevelSolved(followHints(LEVEL))).toBe(true);
  });

  it('fixes a wrong arm, not only an empty one', () => {
    const wrong = LEVEL.map((weight) =>
      weight.locked
        ? weight
        : { ...weight, hook: { side: 'left' as const, distance: weight.id + 2 } },
    );
    expect(isLevelSolved(wrong)).toBe(false);
    expect(isLevelSolved(followHints(wrong))).toBe(true);
  });

  it('gives nothing once the level is solved', () => {
    expect(findHint(followHints(LEVEL))).toBeNull();
  });

  it('solves generated levels by following hints', () => {
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const session = startSession(random);
    session.levels.forEach((level) => expect(isLevelSolved(followHints(level))).toBe(true));
  });
});

describe('precision balance Hint button', () => {
  /** Hangs both free weights on the right, which tilts the arm: a wrong try. */
  const tryWrong = (session: Session) => {
    const hung = playMove(playMove(session, 1, { side: 'right', distance: 4 }), 2, {
      side: 'right',
      distance: 3,
    });
    return resetLevel(hung);
  };

  it('stays hidden until the player missed a few times', () => {
    let session = sessionOn(LEVEL);
    expect(canAskHint(session)).toBe(false);
    expect(askHint(session)).toBeNull();
    for (let miss = 1; miss < WRONG_TRIES_BEFORE_HINT; miss += 1) {
      session = tryWrong(session);
      expect(canAskHint(session)).toBe(false);
    }
    session = tryWrong(session);
    expect(session.wrongTries).toBe(WRONG_TRIES_BEFORE_HINT);
    expect(canAskHint(session)).toBe(true);
  });

  it('does not count a half-hung arm as a wrong try', () => {
    const session = playMove(sessionOn(LEVEL), 1, { side: 'right', distance: 4 });
    expect(session.wrongTries).toBe(0);
  });

  it('counts each hint used and starts over on the next level', () => {
    let session = sessionOn(LEVEL);
    for (let miss = 0; miss < WRONG_TRIES_BEFORE_HINT; miss += 1) session = tryWrong(session);
    const asked = askHint(session);
    expect(asked?.session.hints).toBe(1);
    const next = asked === null ? null : nextLevel(asked.session);
    expect(next?.wrongTries).toBe(0);
    expect(next?.hints).toBe(1);
  });

  it('costs points on the score', () => {
    expect(computeScore(3, 3, 10, 2)).toBe(computeScore(3, 3, 10) - 2 * HINT_PENALTY);
  });
});
