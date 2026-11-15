/** Where a real fact comes from, shown as a link under the mascot's words. */
export type Source = { label: string; url: string };

/** The mascot says something; Next goes on. */
export type TextPage = { kind: 'text'; id?: string; text: string; source?: Source };

/** What picking an option does in the game: start a mission, or decide what to do with the regolith. */
export type DialogueEffect =
  | { kind: 'startMission'; missionId: string }
  | { kind: 'printBricks' }
  | { kind: 'keepRegolith' };

/**
 * One option of a choice: the mascot's reply, then the page it leads to (the next one by default),
 * or, when it has an effect, the end of the dialogue with that effect.
 */
export type ChoiceOption = {
  label: string;
  reply: TextPage[];
  goto?: string;
  effect?: DialogueEffect;
};

/** The player picks one of 1 to 4 options; none is right or wrong. */
export type ChoicePage = { kind: 'choice'; id?: string; text: string; options: ChoiceOption[] };

/** One answer of a question, with what the mascot says when it is picked. */
export type Answer = { label: string; correct: boolean; explanation: string };

/** The player answers a question with 2 to 4 answers, exactly one of them right. */
export type QuestionPage = { kind: 'question'; id?: string; text: string; answers: Answer[] };

export type GuidePage = TextPage | ChoicePage | QuestionPage;

/** What the player takes outside: one tool, oxygen bottles and spare robot batteries. */
export type ToolId = 'standardDrums' | 'wideDrums';

/** How a mission is played: driving the robot in the 3D base, or a mini-game by its id. */
export type GameRef = { kind: 'walk' } | { kind: 'minigame'; id: string };

/** How a mission's result is worked out. */
export type ScoringId = 'excavator' | 'printer' | 'shelter';

export type Mission = {
  id: string;
  title: string;
  /** The goal shown on the station dashboard. */
  goal: string;
  briefing: GuidePage[];
  academy: GuidePage[];
  /** Whether the player packs a bag before the mission. */
  preparation: boolean;
  game: GameRef;
  scoring: ScoringId;
};

/**
 * A day: its title, the mascot's opening (which ends by picking the first mission when there are
 * several), its missions, played in the order the player picks, whether the commander plans the
 * base's work first (the planned action may open a mission), and how the day closes: offering to
 * run the printer overnight, or with the night alone.
 */
export type Day = {
  title: string;
  opening: GuidePage[];
  missions: Mission[];
  planning?: boolean;
  closing: 'printer' | 'night';
  /** A solar storm alert raised on this day's title screen, which ends the demo. */
  alert?: boolean;
};

export type Act = { id: string; days: Day[]; ending: GuidePage[] };
