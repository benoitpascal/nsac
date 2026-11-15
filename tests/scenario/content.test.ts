import { describe, expect, it } from 'vitest';
import { MOON_ACT } from '@/modules/scenario/core/act-moon';
import { MINI_GAMES } from '@/modules/minigames/games/registry';
import type { Day, GuidePage } from '@/modules/scenario/core/scenario-content';

const dialoguesOf = (day: Day): GuidePage[][] => [
  day.opening,
  ...day.missions.flatMap((mission) => [mission.briefing, mission.academy]),
];

const allDialogues = [...MOON_ACT.days.flatMap(dialoguesOf), MOON_ACT.ending];

describe('the Moon act content', () => {
  it('offers 1 to 4 options on every choice, and leads only to pages that exist', () => {
    for (const pages of allDialogues)
      for (const page of pages)
        if (page.kind === 'choice') {
          expect(page.options.length).toBeGreaterThanOrEqual(1);
          expect(page.options.length).toBeLessThanOrEqual(4);
          for (const option of page.options)
            if (option.goto) expect(pages.some((target) => target.id === option.goto)).toBe(true);
        }
  });

  it('asks every question with 2 to 4 answers, exactly one of them right', () => {
    for (const page of allDialogues.flat())
      if (page.kind === 'question') {
        expect(page.answers.length).toBeGreaterThanOrEqual(2);
        expect(page.answers.length).toBeLessThanOrEqual(4);
        expect(page.answers.filter((answer) => answer.correct)).toHaveLength(1);
      }
  });

  it('lets the opening of each day start only missions of that day, and each of them', () => {
    for (const day of MOON_ACT.days.filter((candidate) => candidate.missions.length > 1)) {
      const started = day.opening.flatMap((page) =>
        page.kind === 'choice'
          ? page.options.flatMap((option) =>
              option.effect?.kind === 'startMission' ? [option.effect.missionId] : [],
            )
          : [],
      );
      expect([...started].sort()).toEqual(day.missions.map((mission) => mission.id).sort());
    }
  });

  it('plays only mini-games that exist', () => {
    for (const mission of MOON_ACT.days.flatMap((day) => day.missions))
      if (mission.game.kind === 'minigame') {
        const { id } = mission.game;
        expect(MINI_GAMES.some((game) => game.id === id)).toBe(true);
      }
  });
});
