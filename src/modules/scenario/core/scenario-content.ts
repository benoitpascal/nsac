/** Where a real fact comes from, shown as a link under the mascot's words. */
export type Source = { label: string; url: string };

/** The mascot says something; Next goes on. */
export type TextPage = { kind: 'text'; id?: string; text: string; source?: Source };

/** One option of a choice: the mascot's reply, then the page it leads to (the next one by default). */
export type ChoiceOption = { label: string; reply: TextPage[]; goto?: string };

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
export type ScoringId = 'excavator' | 'laser';

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

/** A card shown under a day's title. */
export type StatusCard = { value: string; label: string };

export type Day = { title: string; statusCards: StatusCard[]; missions: Mission[] };

export type Act = { id: string; days: Day[]; ending: GuidePage[] };
